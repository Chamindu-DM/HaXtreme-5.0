import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { validateEmail, getClientIp, checkRateLimit, RATE_LIMITS } from "@/lib/security";

export async function POST(request: Request) {
  try {
    // 0. Rate Limiting Check (15 checks per minute per IP to prevent email harvesting)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(
      `${RATE_LIMITS.VERIFY.prefix}:${clientIp}`,
      RATE_LIMITS.VERIFY.max,
      RATE_LIMITS.VERIFY.windowSeconds
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many verification requests. Please try again later.",
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
            "X-RateLimit-Limit": String(RATE_LIMITS.VERIFY.max),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.resetSeconds),
          },
        }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const emailVal = validateEmail(email, "Email");
    if (!emailVal.valid) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = emailVal.sanitized.toLowerCase();

    // 1. Check if email belongs to a team leader
    const { data: teamAsLeader, error: leaderError } = await supabaseAdmin
      .from("teams")
      .select("id, team_name, leader_name, status")
      .eq("leader_email", normalizedEmail)
      .maybeSingle();

    if (leaderError) {
      console.error("Verify leader error:", leaderError);
    }

    if (teamAsLeader) {
      return NextResponse.json({
        success: true,
        teamName: teamAsLeader.team_name,
        participantName: teamAsLeader.leader_name,
        status: teamAsLeader.status,
        qualified: false,
        message: "Virtual Photobooth unlocks strictly after the Online Preliminary Round.",
      });
    }

    // 2. Check if email belongs to any registered participant (registrations table or team_members)
    const { data: regParticipant, error: regError } = await supabaseAdmin
      .from("registrations")
      .select("member_name, team_id, teams(team_name, status)")
      .eq("member_email", normalizedEmail)
      .maybeSingle();

    if (!regError && regParticipant && regParticipant.teams) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const teamObj: any = Array.isArray(regParticipant.teams)
        ? regParticipant.teams[0]
        : regParticipant.teams;

      return NextResponse.json({
        success: true,
        teamName: teamObj?.team_name || "Team",
        participantName: regParticipant.member_name,
        status: teamObj?.status || "registered",
        qualified: false,
        message: "Virtual Photobooth unlocks strictly after the Online Preliminary Round.",
      });
    }

    // Fallback: Check legacy team_members table
    const { data: memberData, error: memberError } = await supabaseAdmin
      .from("team_members")
      .select("member_name, team_id, teams(team_name, status)")
      .eq("member_email", normalizedEmail)
      .maybeSingle();

    if (memberError) {
      console.error("Verify member error:", memberError);
    }

    if (memberData && memberData.teams) {
      // Supabase join might return an object or array
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const teamObj: any = Array.isArray(memberData.teams)
        ? memberData.teams[0]
        : memberData.teams;

      return NextResponse.json({
        success: true,
        teamName: teamObj?.team_name || "Team",
        participantName: memberData.member_name,
        status: teamObj?.status || "registered",
        qualified: false,
        message: "Virtual Photobooth unlocks strictly after the Online Preliminary Round.",
      });
    }

    return NextResponse.json(
      { success: false, error: "No registration found with this email." },
      { status: 404 }
    );
  } catch (err: unknown) {
    console.error("API /api/auth/verify error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to verify registration." },
      { status: 500 }
    );
  }
}
