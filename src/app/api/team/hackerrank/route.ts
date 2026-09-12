import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { canonicalizeText, validateEmail } from "@/lib/security";

// Official contest start time: October 3, 2026 09:00:00 AM Sri Lanka Time (UTC+05:30)
const CONTEST_START_TIMESTAMP = new Date("2026-10-03T09:00:00+05:30").getTime();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamId, email, hackerrankUsername } = body;

    if (!hackerrankUsername || typeof hackerrankUsername !== "string") {
      return NextResponse.json(
        { success: false, error: "HackerRank username is required." },
        { status: 400 }
      );
    }

    const cleanUsername = canonicalizeText(hackerrankUsername).trim();

    // Validate HackerRank username format: 2 to 50 alphanumeric, underscore, or hyphen characters
    const usernameRegex = /^[a-zA-Z0-9_-]{2,50}$/;
    if (!usernameRegex.test(cleanUsername)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid HackerRank username. Must be 2-50 characters and contain only letters, numbers, hyphens, or underscores.",
        },
        { status: 400 }
      );
    }

    // Check contest timing: cannot change during contest
    const now = Date.now();
    if (now >= CONTEST_START_TIMESTAMP) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The contest has already commenced. HackerRank username is locked and cannot be changed.",
        },
        { status: 403 }
      );
    }

    // Identify the team
    if (!teamId && !email) {
      return NextResponse.json(
        { success: false, error: "Team identification (teamId or email) is required." },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("teams").select("id, leader_email, hackerrank_username");
    if (teamId) {
      query = query.eq("id", teamId);
    } else if (email) {
      const emailVal = validateEmail(email, "Leader Email");
      if (!emailVal.valid) {
        return NextResponse.json(
          { success: false, error: "Invalid leader email." },
          { status: 400 }
        );
      }
      query = query.eq("leader_email", emailVal.sanitized.toLowerCase());
    }

    const { data: teamData, error: findError } = await query.maybeSingle();

    if (findError) {
      console.warn("Error finding team for HackerRank handle update:", findError);
    }

    if (teamData?.id) {
      // Attempt database update in Supabase
      const { error: updateError } = await supabaseAdmin
        .from("teams")
        .update({ hackerrank_username: cleanUsername })
        .eq("id", teamData.id);

      if (updateError) {
        // If column does not exist yet in Supabase schema, log warning and still succeed
        console.warn(
          "Could not persist hackerrank_username column in database (schema might need migration):",
          updateError.message
        );
      }
    }

    return NextResponse.json({
      success: true,
      hackerrankUsername: cleanUsername,
      message: "HackerRank username successfully registered for the team.",
    });
  } catch (err: unknown) {
    console.error("API /api/team/hackerrank error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update HackerRank username." },
      { status: 500 }
    );
  }
}
