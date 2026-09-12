import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { validateEmail } from "@/lib/security";

export async function POST(request: Request) {
  try {
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
      const isQualified =
        teamAsLeader.status === "qualified" || teamAsLeader.status === "finalist";

      return NextResponse.json({
        success: true,
        teamName: teamAsLeader.team_name,
        participantName: teamAsLeader.leader_name,
        status: teamAsLeader.status,
        qualified: isQualified,
      });
    }

    // 2. Check if email belongs to a team member
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

      const isQualified =
        teamObj?.status === "qualified" || teamObj?.status === "finalist";

      return NextResponse.json({
        success: true,
        teamName: teamObj?.team_name || "Team",
        participantName: memberData.member_name,
        status: teamObj?.status || "registered",
        qualified: isQualified,
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
