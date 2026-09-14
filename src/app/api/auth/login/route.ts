import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import {
  validateEmail,
  getClientIp,
  checkRateLimit,
  RATE_LIMITS,
} from "@/lib/security";
import { verifyPassword, hashPassword } from "@/lib/cryptoServer";
import type { TeamSessionData } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // 0. Rate Limiting Check (5 attempts per 5 minutes per IP)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(
      `${RATE_LIMITS.LOGIN.prefix}:${clientIp}`,
      RATE_LIMITS.LOGIN.max,
      RATE_LIMITS.LOGIN.windowSeconds
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed login attempts. Please wait before trying again.",
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
            "X-RateLimit-Limit": String(RATE_LIMITS.LOGIN.max),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.resetSeconds),
          },
        }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const emailVal = validateEmail(email, "Leader Email");
    if (!emailVal.valid) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = emailVal.sanitized.toLowerCase();

    // Query team from database via server-side client
    const { data: teamData, error: teamError } = await supabaseAdmin
      .from("teams")
      .select("*")
      .eq("leader_email", normalizedEmail)
      .maybeSingle();

    if (teamError) {
      console.error("Login database error:", teamError);
      return NextResponse.json(
        { success: false, error: "Database error occurred during login." },
        { status: 500 }
      );
    }

    if (!teamData) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password hash on the server (supports both salted and legacy hashes)
    if (teamData.password_hash) {
      const isMatch = verifyPassword(password, teamData.password_hash);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password." },
          { status: 401 }
        );
      }

      // Transparent upgrade: If legacy unsalted hash, upgrade to salted hash in database
      if (!teamData.password_hash.includes(":")) {
        const upgraded = hashPassword(password);
        await supabaseAdmin
          .from("teams")
          .update({ password_hash: upgraded.stored })
          .eq("id", teamData.id);
      }
    }

    // Fetch team members
    const { data: membersData, error: membersError } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .eq("team_id", teamData.id)
      .order("member_order", { ascending: true });

    if (membersError) {
      console.warn("Could not fetch team members on login:", membersError);
    }

    const m2 = membersData?.find((m) => m.member_order === 2);
    const m3 = membersData?.find((m) => m.member_order === 3);

    // Build sanitized session payload (omitting password hash)
    const sessionData: TeamSessionData = {
      id: teamData.id,
      teamName: teamData.team_name,
      category: teamData.category || "University",
      institution: teamData.institution,
      leader: {
        name: teamData.leader_name,
        email: teamData.leader_email,
        phone: teamData.leader_phone,
        isIeeeMember: !!teamData.leader_ieee_member,
        ieeeNumber: teamData.leader_ieee_number || undefined,
      },
      member2: {
        name: m2?.member_name || "",
        email: m2?.member_email || "",
        phone: m2?.member_phone || "",
        isIeeeMember: !!m2?.member_ieee_member,
        ieeeNumber: m2?.member_ieee_number || undefined,
      },
      member3: {
        name: m3?.member_name || "",
        email: m3?.member_email || "",
        phone: m3?.member_phone || "",
        isIeeeMember: !!m3?.member_ieee_member,
        ieeeNumber: m3?.member_ieee_number || undefined,
      },
      status: teamData.status || "registered",
      hackerrankUsername: teamData.hackerrank_username || undefined,
      registeredAt: teamData.created_at,
    };

    return NextResponse.json({
      success: true,
      team: sessionData,
    });
  } catch (err: unknown) {
    console.error("API /api/auth/login error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
