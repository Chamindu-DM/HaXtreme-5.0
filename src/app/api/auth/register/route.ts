import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseServer";
import {
  validateTeamName,
  validatePersonName,
  validateEmail,
  validatePhoneNumber,
  validateInstitution,
  validateIeeeNumber,
  validatePassword,
} from "@/lib/security";
import type { TeamSessionData } from "@/lib/auth";

function hashPasswordServer(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      category,
      teamName,
      institution,
      leaderName,
      leaderEmail,
      leaderPhone,
      leaderIeee,
      leaderIeeeNumber,
      member2Name,
      member2Email,
      member2Phone,
      member2Ieee,
      member2IeeeNumber,
      member3Name,
      member3Email,
      member3Phone,
      member3Ieee,
      member3IeeeNumber,
      password,
      agreedToRules,
    } = body;

    // 1. Rules Agreement
    if (!agreedToRules) {
      return NextResponse.json(
        { success: false, error: "You must accept the official rules and code of conduct." },
        { status: 400 }
      );
    }

    // 2. Category & Institution Validation
    const safeCategory: "University" | "School" =
      category === "School" ? "School" : "University";

    const instVal = validateInstitution(institution);
    if (!instVal.valid) {
      return NextResponse.json(
        { success: false, error: instVal.error || "Invalid institution." },
        { status: 400 }
      );
    }

    // 3. Team Name Validation
    const teamVal = validateTeamName(teamName);
    if (!teamVal.valid) {
      return NextResponse.json(
        { success: false, error: teamVal.error || "Invalid team name." },
        { status: 400 }
      );
    }

    // 4. Leader Validation
    const lNameVal = validatePersonName(leaderName, "Team Leader Name");
    if (!lNameVal.valid) {
      return NextResponse.json({ success: false, error: lNameVal.error }, { status: 400 });
    }

    const lEmailVal = validateEmail(leaderEmail, "Team Leader Email");
    if (!lEmailVal.valid) {
      return NextResponse.json({ success: false, error: lEmailVal.error }, { status: 400 });
    }

    const lPhoneVal = validatePhoneNumber(leaderPhone, "Team Leader Phone");
    if (!lPhoneVal.valid) {
      return NextResponse.json({ success: false, error: lPhoneVal.error }, { status: 400 });
    }

    let cleanLeaderIeee = "";
    if (leaderIeee) {
      const lIeeeVal = validateIeeeNumber(leaderIeeeNumber, "Team Leader IEEE Number");
      if (!lIeeeVal.valid) {
        return NextResponse.json({ success: false, error: lIeeeVal.error }, { status: 400 });
      }
      cleanLeaderIeee = lIeeeVal.sanitized;
    }

    // 5. Member 2 Validation
    const m2NameVal = validatePersonName(member2Name, "Member 2 Name");
    if (!m2NameVal.valid) {
      return NextResponse.json({ success: false, error: m2NameVal.error }, { status: 400 });
    }

    const m2EmailVal = validateEmail(member2Email, "Member 2 Email");
    if (!m2EmailVal.valid) {
      return NextResponse.json({ success: false, error: m2EmailVal.error }, { status: 400 });
    }

    const m2PhoneVal = validatePhoneNumber(member2Phone, "Member 2 Phone");
    if (!m2PhoneVal.valid) {
      return NextResponse.json({ success: false, error: m2PhoneVal.error }, { status: 400 });
    }

    let cleanM2Ieee = "";
    if (member2Ieee) {
      const m2IeeeVal = validateIeeeNumber(member2IeeeNumber, "Member 2 IEEE Number");
      if (!m2IeeeVal.valid) {
        return NextResponse.json({ success: false, error: m2IeeeVal.error }, { status: 400 });
      }
      cleanM2Ieee = m2IeeeVal.sanitized;
    }

    // 6. Member 3 Validation (Compulsory)
    const m3NameVal = validatePersonName(member3Name, "Member 3 Name");
    if (!m3NameVal.valid) {
      return NextResponse.json({ success: false, error: m3NameVal.error }, { status: 400 });
    }

    const m3EmailVal = validateEmail(member3Email, "Member 3 Email");
    if (!m3EmailVal.valid) {
      return NextResponse.json({ success: false, error: m3EmailVal.error }, { status: 400 });
    }

    const m3PhoneVal = validatePhoneNumber(member3Phone, "Member 3 Phone");
    if (!m3PhoneVal.valid) {
      return NextResponse.json({ success: false, error: m3PhoneVal.error }, { status: 400 });
    }

    let cleanM3Ieee = "";
    if (member3Ieee) {
      const m3IeeeVal = validateIeeeNumber(member3IeeeNumber, "Member 3 IEEE Number");
      if (!m3IeeeVal.valid) {
        return NextResponse.json({ success: false, error: m3IeeeVal.error }, { status: 400 });
      }
      cleanM3Ieee = m3IeeeVal.sanitized;
    }

    // 7. Duplicate Email Checks Within Team
    const cleanLeaderEmail = lEmailVal.sanitized.toLowerCase();
    const cleanM2Email = m2EmailVal.sanitized.toLowerCase();
    const cleanM3Email = m3EmailVal.sanitized.toLowerCase();

    if (cleanLeaderEmail === cleanM2Email) {
      return NextResponse.json(
        { success: false, error: "Member 2 cannot have the same email as Team Leader." },
        { status: 400 }
      );
    }
    if (cleanLeaderEmail === cleanM3Email) {
      return NextResponse.json(
        { success: false, error: "Member 3 cannot have the same email as Team Leader." },
        { status: 400 }
      );
    }
    if (cleanM2Email === cleanM3Email) {
      return NextResponse.json(
        { success: false, error: "Member 3 cannot have the same email as Member 2." },
        { status: 400 }
      );
    }

    // 8. Password Validation
    const pwdVal = validatePassword(password);
    if (!pwdVal.valid) {
      return NextResponse.json(
        { success: false, error: pwdVal.error || "Password does not meet security requirements." },
        { status: 400 }
      );
    }

    const passwordHash = hashPasswordServer(password);
    const cleanTeamName = teamVal.sanitized;
    const cleanInstitution = instVal.sanitized;

    // 9. Database Checks via Server Supabase Admin Client
    try {
      // Check if team name already exists
      const { data: existingTeamByName } = await supabaseAdmin
        .from("teams")
        .select("id")
        .ilike("team_name", cleanTeamName)
        .maybeSingle();

      if (existingTeamByName) {
        return NextResponse.json(
          { success: false, error: "A team with this name is already registered." },
          { status: 409 }
        );
      }

      // Check if leader email already exists
      const { data: existingTeamByEmail } = await supabaseAdmin
        .from("teams")
        .select("id")
        .eq("leader_email", cleanLeaderEmail)
        .maybeSingle();

      if (existingTeamByEmail) {
        return NextResponse.json(
          { success: false, error: "This Team Leader email address is already registered." },
          { status: 409 }
        );
      }

      // Insert Team Record
      const { data: insertedTeam, error: teamInsertError } = await supabaseAdmin
        .from("teams")
        .insert({
          team_name: cleanTeamName,
          category: safeCategory,
          institution: cleanInstitution,
          leader_name: lNameVal.sanitized,
          leader_email: cleanLeaderEmail,
          leader_phone: lPhoneVal.sanitized,
          leader_ieee_member: !!leaderIeee,
          leader_ieee_number: cleanLeaderIeee || null,
          password_hash: passwordHash,
          status: "registered",
        })
        .select("id, created_at")
        .single();

      if (teamInsertError || !insertedTeam) {
        console.error("Team insert error:", teamInsertError);
        throw new Error(teamInsertError?.message || "Failed to create team record.");
      }

      const teamId = insertedTeam.id;

      // Insert 2 Team Members
      const membersToInsert = [
        {
          team_id: teamId,
          member_order: 2,
          member_name: m2NameVal.sanitized,
          member_email: cleanM2Email,
          member_phone: m2PhoneVal.sanitized,
          member_ieee_member: !!member2Ieee,
          member_ieee_number: cleanM2Ieee || null,
        },
        {
          team_id: teamId,
          member_order: 3,
          member_name: m3NameVal.sanitized,
          member_email: cleanM3Email,
          member_phone: m3PhoneVal.sanitized,
          member_ieee_member: !!member3Ieee,
          member_ieee_number: cleanM3Ieee || null,
        },
      ];

      const { error: membersInsertError } = await supabaseAdmin
        .from("team_members")
        .insert(membersToInsert);

      if (membersInsertError) {
        console.error("Members insert error:", membersInsertError);
        // Clean up orphaned team record if member insert fails
        await supabaseAdmin.from("teams").delete().eq("id", teamId);
        throw new Error("Failed to register team members. Please try again.");
      }

      // Build safe session object (NEVER include passwordHash)
      const sessionData: TeamSessionData = {
        id: teamId,
        teamName: cleanTeamName,
        category: safeCategory,
        institution: cleanInstitution,
        leader: {
          name: lNameVal.sanitized,
          email: cleanLeaderEmail,
          phone: lPhoneVal.sanitized,
          isIeeeMember: !!leaderIeee,
          ieeeNumber: cleanLeaderIeee || undefined,
        },
        member2: {
          name: m2NameVal.sanitized,
          email: cleanM2Email,
          phone: m2PhoneVal.sanitized,
          isIeeeMember: !!member2Ieee,
          ieeeNumber: cleanM2Ieee || undefined,
        },
        member3: {
          name: m3NameVal.sanitized,
          email: cleanM3Email,
          phone: m3PhoneVal.sanitized,
          isIeeeMember: !!member3Ieee,
          ieeeNumber: cleanM3Ieee || undefined,
        },
        status: "registered",
        registeredAt: insertedTeam.created_at || new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        team: sessionData,
      });
    } catch (dbErr: unknown) {
      const msg = dbErr instanceof Error ? dbErr.message : "Database unavailable.";
      console.error("Database operation failed:", dbErr);
      return NextResponse.json(
        { success: false, error: msg },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    console.error("API /api/auth/register error:", err);
    return NextResponse.json(
      { success: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
