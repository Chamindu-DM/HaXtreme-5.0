"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { setTeamSession, getTeamSession, clearTeamSession, TeamSessionData } from "@/lib/auth";
import {
  validateTeamName,
  validatePersonName,
  validateEmail,
  validatePhoneNumber,
  validateInstitution,
  validateIeeeNumber,
  validatePassword,
  canonicalizeText,
} from "@/lib/security";

export const UNIVERSITIES = [
  "University of Ruhuna",
  "University of Moratuwa",
  "University of Colombo",
  "Sri Lanka Institute of Information Technology -SLIIT",
  "Uva Wellassa University",
  "Informatics Institute of Technology",
  "Wayamba University of Sri Lanka",
  "General Sir John Kotelawala Defence University",
  "Sabaragamuwa University of Sri Lanka",
  "Open University of Sri Lanka",
  "University of Kelaniya",
  "NSBM Green University",
  "University of Sri Jayewardenepura",
  "Sri Lanka Technological Campus",
  "Rajarata University of Sri Lanka",
  "University of Vavuniya",
  "University of Vocational Technology",
  "University of Jaffna",
  "South Eastern University of Sri Lanka",
  "National Inst of Business Management-Sri Lanka – NIBM",
  "CINEC Campus",
  "University of Peradeniya",
  "Other / School Institution",
];

const RULES = [
  "A team must consist of exactly three members from the same institution.",
  "For the University category, all members must be active undergraduates.",
  "For the School category, all members must be current school students.",
  "Sharing of code or collaborating with other teams during the qualifier is strictly prohibited and will result in immediate disqualification.",
  "Plagiarism of any form will be automatically flagged by the evaluation system.",
  "Decisions made by the judging panel and the organizing committee will be final and binding.",
];

interface TeamData {
  id: string;
  team_name: string;
  category: "University" | "School";
  institution: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_ieee_member: boolean;
  leader_ieee_number?: string;
  member2_name: string;
  member2_email: string;
  member2_phone: string;
  member2_ieee: boolean;
  member2_ieee_number?: string;
  member3_name: string;
  member3_email: string;
  member3_phone: string;
  member3_ieee: boolean;
  member3_ieee_number?: string;
  status: "registered" | "qualified" | "finalist";
  created_at?: string;
}


export default function RegisterPageClient() {
  const router = useRouter();
  const [view, setView] = useState<"register" | "signin" | "dashboard">("register");
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);

  // Form State
  const [category, setCategory] = useState<"University" | "School">("University");
  const [teamName, setTeamName] = useState("");
  const [university, setUniversity] = useState("");
  const [customInstitution, setCustomInstitution] = useState("");

  // Leader
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderIeee, setLeaderIeee] = useState(false);
  const [leaderIeeeNumber, setLeaderIeeeNumber] = useState("");

  // Member 2
  const [member2Name, setMember2Name] = useState("");
  const [member2Email, setMember2Email] = useState("");
  const [member2Phone, setMember2Phone] = useState("");
  const [member2Ieee, setMember2Ieee] = useState(false);
  const [member2IeeeNumber, setMember2IeeeNumber] = useState("");

  // Member 3 (Compulsory)
  const [member3Name, setMember3Name] = useState("");
  const [member3Email, setMember3Email] = useState("");
  const [member3Phone, setMember3Phone] = useState("");
  const [member3Ieee, setMember3Ieee] = useState(false);
  const [member3IeeeNumber, setMember3IeeeNumber] = useState("");

  // Passwords
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);

  // Validation feedback state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Sign in state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Active Team Session (if signed in)
  const [currentTeam, setCurrentTeam] = useState<TeamData | null>(null);

  // Load existing session on mount
  useEffect(() => {
    try {
      const saved = getTeamSession();
      if (saved) {
        const mapped: TeamData = {
          id: saved.id || "",
          team_name: saved.teamName,
          category: saved.category,
          institution: saved.institution,
          leader_name: saved.leader.name,
          leader_email: saved.leader.email,
          leader_phone: saved.leader.phone,
          leader_ieee_member: saved.leader.isIeeeMember,
          leader_ieee_number: saved.leader.ieeeNumber,
          member2_name: saved.member2.name,
          member2_email: saved.member2.email,
          member2_phone: saved.member2.phone,
          member2_ieee: saved.member2.isIeeeMember,
          member2_ieee_number: saved.member2.ieeeNumber,
          member3_name: saved.member3.name,
          member3_email: saved.member3.email,
          member3_phone: saved.member3.phone,
          member3_ieee: saved.member3.isIeeeMember,
          member3_ieee_number: saved.member3.ieeeNumber,
          status: saved.status,
          created_at: saved.registeredAt,
        };
        setCurrentTeam(mapped);
      }
    } catch {
      // Ignore session read error
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    const errors: Record<string, string> = {};

    // 1. Team Name
    const teamValidation = validateTeamName(teamName);
    if (!teamValidation.valid) {
      errors.teamName = teamValidation.error!;
    }

    // 2. Institution / University
    const isOther = category === "School" || university === "Other / School Institution";
    const instTarget = isOther ? customInstitution : university;
    const instValidation = validateInstitution(instTarget, UNIVERSITIES, isOther);
    if (!instValidation.valid) {
      errors.institution = instValidation.error!;
    }

    // 3. Team Leader
    const leaderNameVal = validatePersonName(leaderName, "Leader Name");
    if (!leaderNameVal.valid) errors.leaderName = leaderNameVal.error!;

    const leaderEmailVal = validateEmail(leaderEmail, "Leader Email");
    let cleanLeaderEmail = "";
    if (!leaderEmailVal.valid) errors.leaderEmail = leaderEmailVal.error!;
    else cleanLeaderEmail = leaderEmailVal.sanitized;

    const leaderPhoneVal = validatePhoneNumber(leaderPhone, "Leader Contact Number");
    if (!leaderPhoneVal.valid) errors.leaderPhone = leaderPhoneVal.error!;

    let cleanLeaderIeeeNum = "";
    if (leaderIeee) {
      const leaderIeeeVal = validateIeeeNumber(leaderIeeeNumber, "Leader IEEE Membership Number");
      if (!leaderIeeeVal.valid) errors.leaderIeeeNumber = leaderIeeeVal.error!;
      else cleanLeaderIeeeNum = leaderIeeeVal.sanitized;
    }

    // 4. Member 2
    const m2NameVal = validatePersonName(member2Name, "Member 2 Name");
    if (!m2NameVal.valid) errors.member2Name = m2NameVal.error!;

    const m2EmailVal = validateEmail(member2Email, "Member 2 Email");
    let cleanM2Email = "";
    if (!m2EmailVal.valid) errors.member2Email = m2EmailVal.error!;
    else cleanM2Email = m2EmailVal.sanitized;

    const m2PhoneVal = validatePhoneNumber(member2Phone, "Member 2 Contact Number");
    if (!m2PhoneVal.valid) errors.member2Phone = m2PhoneVal.error!;

    let cleanM2IeeeNum = "";
    if (member2Ieee) {
      const m2IeeeVal = validateIeeeNumber(member2IeeeNumber, "Member 2 IEEE Membership Number");
      if (!m2IeeeVal.valid) errors.member2IeeeNumber = m2IeeeVal.error!;
      else cleanM2IeeeNum = m2IeeeVal.sanitized;
    }

    // Check duplicate emails
    if (cleanLeaderEmail && cleanM2Email && cleanLeaderEmail.toLowerCase() === cleanM2Email.toLowerCase()) {
      errors.member2Email = "Member 2 cannot have the same email as the Team Leader.";
    }

    // 5. Member 3 (Compulsory)
    const m3NameVal = validatePersonName(member3Name, "Member 3 Name");
    if (!m3NameVal.valid) errors.member3Name = m3NameVal.error!;
    const cleanM3Name = m3NameVal.sanitized;

    const m3EmailVal = validateEmail(member3Email, "Member 3 Email");
    let cleanM3Email = "";
    if (!m3EmailVal.valid) errors.member3Email = m3EmailVal.error!;
    else cleanM3Email = m3EmailVal.sanitized;

    const m3PhoneVal = validatePhoneNumber(member3Phone, "Member 3 Contact Number");
    if (!m3PhoneVal.valid) errors.member3Phone = m3PhoneVal.error!;

    let cleanM3IeeeNum = "";
    if (member3Ieee) {
      const m3IeeeVal = validateIeeeNumber(member3IeeeNumber, "Member 3 IEEE Membership Number");
      if (!m3IeeeVal.valid) errors.member3IeeeNumber = m3IeeeVal.error!;
      else cleanM3IeeeNum = m3IeeeVal.sanitized;
    }

    if (cleanM3Email && cleanLeaderEmail && cleanM3Email.toLowerCase() === cleanLeaderEmail.toLowerCase()) {
      errors.member3Email = "Member 3 cannot have the same email as the Team Leader.";
    }
    if (cleanM3Email && cleanM2Email && cleanM3Email.toLowerCase() === cleanM2Email.toLowerCase()) {
      errors.member3Email = "Member 3 cannot have the same email as Member 2.";
    }

    // 6. Password
    const pwdVal = validatePassword(password);
    if (!pwdVal.valid) {
      errors.password = pwdVal.error!;
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    // 7. Rules agreement
    if (!agreedToRules) {
      errors.agreedToRules = "You must read and agree to the competition rules.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError("Please fix the highlighted errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          teamName: teamValidation.sanitized,
          institution: instValidation.sanitized,
          leaderName: leaderNameVal.sanitized,
          leaderEmail: cleanLeaderEmail,
          leaderPhone: leaderPhoneVal.sanitized,
          leaderIeee: Boolean(leaderIeee),
          leaderIeeeNumber: cleanLeaderIeeeNum || undefined,
          member2Name: m2NameVal.sanitized,
          member2Email: cleanM2Email,
          member2Phone: m2PhoneVal.sanitized,
          member2Ieee: Boolean(member2Ieee),
          member2IeeeNumber: cleanM2IeeeNum || undefined,
          member3Name: cleanM3Name,
          member3Email: cleanM3Email,
          member3Phone: m3PhoneVal.sanitized,
          member3Ieee: Boolean(member3Ieee),
          member3IeeeNumber: cleanM3IeeeNum || undefined,
          password,
          agreedToRules,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setFormError(resData.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      const sessionData: TeamSessionData = resData.team;
      setTeamSession(sessionData);

      const mapped: TeamData = {
        id: sessionData.id || "",
        team_name: sessionData.teamName,
        category: sessionData.category,
        institution: sessionData.institution,
        leader_name: sessionData.leader.name,
        leader_email: sessionData.leader.email,
        leader_phone: sessionData.leader.phone,
        leader_ieee_member: sessionData.leader.isIeeeMember,
        leader_ieee_number: sessionData.leader.ieeeNumber,
        member2_name: sessionData.member2.name,
        member2_email: sessionData.member2.email,
        member2_phone: sessionData.member2.phone,
        member2_ieee: sessionData.member2.isIeeeMember,
        member2_ieee_number: sessionData.member2.ieeeNumber,
        member3_name: sessionData.member3.name,
        member3_email: sessionData.member3.email,
        member3_phone: sessionData.member3.phone,
        member3_ieee: sessionData.member3.isIeeeMember,
        member3_ieee_number: sessionData.member3.ieeeNumber,
        status: sessionData.status,
        created_at: sessionData.registeredAt,
      };
      setCurrentTeam(mapped);

      setFormSuccess("Registration complete. Redirecting to Contest Portal...");
      setTimeout(() => {
        router.push("/contest");
      }, 1000);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setFormError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    const emailVal = validateEmail(signInEmail, "Leader Email");
    if (!emailVal.valid) {
      setSignInError(emailVal.error || "Please enter a valid email address.");
      return;
    }

    if (!signInPassword) {
      setSignInError("Password is required.");
      return;
    }

    setSignInLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailVal.sanitized,
          password: signInPassword,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setSignInError(resData.error || "Invalid email or password.");
        setSignInLoading(false);
        return;
      }

      const sessionData: TeamSessionData = resData.team;
      setTeamSession(sessionData);

      const mapped: TeamData = {
        id: sessionData.id || "",
        team_name: sessionData.teamName,
        category: sessionData.category,
        institution: sessionData.institution,
        leader_name: sessionData.leader.name,
        leader_email: sessionData.leader.email,
        leader_phone: sessionData.leader.phone,
        leader_ieee_member: sessionData.leader.isIeeeMember,
        leader_ieee_number: sessionData.leader.ieeeNumber,
        member2_name: sessionData.member2.name,
        member2_email: sessionData.member2.email,
        member2_phone: sessionData.member2.phone,
        member2_ieee: sessionData.member2.isIeeeMember,
        member2_ieee_number: sessionData.member2.ieeeNumber,
        member3_name: sessionData.member3.name,
        member3_email: sessionData.member3.email,
        member3_phone: sessionData.member3.phone,
        member3_ieee: sessionData.member3.isIeeeMember,
        member3_ieee_number: sessionData.member3.ieeeNumber,
        status: sessionData.status,
        created_at: sessionData.registeredAt,
      };

      setCurrentTeam(mapped);
      router.push("/contest");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Sign in failed.";
      setSignInError(errorMsg);
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignOut = () => {
    setCurrentTeam(null);
    clearTeamSession();
    setView("register");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0E100F] text-[#ededed] font-['Helvetica_Neue','Inter',sans-serif] selection:bg-[#0ae448] selection:text-black relative">
      <Navbar />

      {/* Top Header Bar */}
      <section className="relative w-full pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-b border-[#242622] bg-[#0E100F]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase">
              Join <span className="text-[#0ae448]">HaXtreme</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#34352F] text-xs font-['Space_Mono',monospace] uppercase text-[#bbbaa6] hover:text-[#0ae448] hover:border-[#0ae448] transition-colors rounded-none"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Home</span>
            </Link>

            {currentTeam && (
              <>
                <Link
                  href="/contest"
                  className="px-3.5 py-1.5 font-bold text-black bg-[#0ae448] text-xs font-['Space_Mono',monospace] uppercase hover:brightness-110 transition-all rounded-none"
                >
                  Contest Portal
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3.5 py-1.5 border border-red-500/30 text-xs font-['Space_Mono',monospace] uppercase text-red-400 hover:bg-red-500/10 transition-colors rounded-none"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-0 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Competition Rules & Guidelines */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-[#141615] border border-[#242622] p-6 sm:p-7 shadow-xl rounded-none flex flex-col gap-6">
              
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#242622]">
                  <h2 className="text-sm font-bold text-white tracking-wide uppercase font-['Space_Mono',monospace] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#0ae448]" />
                    <span>Competition Rules</span>
                  </h2>
                  <span className="text-[10px] font-['Space_Mono',monospace] text-[#0ae448] bg-[#0ae448]/10 px-2 py-0.5 rounded-none uppercase">
                    Official
                  </span>
                </div>

                <ol className="space-y-3 text-xs sm:text-sm text-[#bbbaa6] leading-relaxed">
                  {RULES.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 font-['Space_Mono',monospace] text-[#0ae448] font-bold text-xs mt-0.5">
                        {idx + 1}.
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Handbook Button */}
              <div className="pt-4 border-t border-[#242622]">
                <button
                  type="button"
                  onClick={() => setIsHandbookOpen(true)}
                  className="w-full py-2.5 px-4 bg-[#191b1a] hover:bg-[#202321] text-[#ededed] hover:text-[#0ae448] border border-[#34352F] hover:border-[#0ae448]/50 transition-all text-xs font-['Space_Mono',monospace] uppercase font-bold tracking-wider rounded-none flex items-center justify-between"
                >
                  <span>View Official Handbook</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              {/* Photobooth Access Note */}
              <div className="pt-4 border-t border-[#242622] text-xs text-[#7c7c6f] leading-relaxed">
                <p>
                  <strong className="text-[#bbbaa6]">Virtual Photobooth:</strong> Unlocks after completing at least one task in the online round and final.
                </p>
                {currentTeam && (
                  <div className="mt-2 flex items-center justify-between font-['Space_Mono',monospace]">
                    <span>Status: <span className="text-white uppercase">{currentTeam.status}</span></span>
                    <span className="text-amber-400">Locked (Unlocks after Preliminary Round)</span>
                  </div>
                )}
              </div>

              {/* Inquiries */}
              <div className="pt-2 text-[11px] text-[#7c7c6f] font-['Space_Mono',monospace]">
                Technical Inquiries:{" "}
                <a href="mailto:haxtreme@ieeeuor.org" className="text-[#0ae448] hover:underline">
                  haxtreme@ieeeuor.org
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column: Registration / Sign In / Dashboard */}
          <div className="lg:col-span-7" id="registration-form">
            
            {/* View 1: Registration Form */}
            {view === "register" && (
              <div className="bg-[#141615] border border-[#242622] p-6 sm:p-8 shadow-xl rounded-none">
                
                {/* Header & Switcher */}
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#242622]">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
                      Team Registration
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setView("signin");
                      setFormError(null);
                      setFieldErrors({});
                    }}
                    className="text-xs font-['Space_Mono',monospace] text-[#0ae448] hover:underline uppercase font-bold"
                  >
                    Sign In &rarr;
                  </button>
                </div>

                {/* Form Alerts */}
                {formError && (
                  <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/60 text-red-400 text-xs flex items-start gap-2.5 rounded-none">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="mb-6 p-3.5 bg-[#0ae448]/10 border border-[#0ae448]/60 text-[#0ae448] text-xs flex items-start gap-2.5 rounded-none">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{formSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6" noValidate>
                  
                  {/* Category Selector */}
                  <div>
                    <label className="form-label mb-2">Category Selection *</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-[#0e100f] border border-[#34352F]">
                      <button
                        type="button"
                        onClick={() => {
                          setCategory("University");
                          setCustomInstitution("");
                        }}
                        className={`py-2 px-3 font-['Space_Mono',monospace] text-xs font-bold uppercase transition-all rounded-none ${
                          category === "University"
                            ? "bg-[#0ae448] text-black"
                            : "text-[#7c7c6f] hover:text-white"
                        }`}
                      >
                        University Category
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCategory("School");
                          setUniversity("");
                        }}
                        className={`py-2 px-3 font-['Space_Mono',monospace] text-xs font-bold uppercase transition-all rounded-none ${
                          category === "School"
                            ? "bg-[#0ae448] text-black"
                            : "text-[#7c7c6f] hover:text-white"
                        }`}
                      >
                        School Category
                      </button>
                    </div>
                  </div>

                  {/* Section 1: Team Details */}
                  <div className="space-y-4 pt-4 border-t border-[#242622]">
                    <h3 className="font-['Space_Mono',monospace] text-xs font-bold text-[#0ae448] uppercase tracking-wider">
                      01. Team Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" htmlFor="teamName">Team Name *</label>
                        <input
                          id="teamName"
                          type="text"
                          maxLength={40}
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="e.g. BinaryBeasts"
                          className={`form-input rounded-none ${fieldErrors.teamName ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.teamName && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.teamName}</p>
                        )}
                      </div>

                      {category === "University" ? (
                        <div>
                          <label className="form-label" htmlFor="university">University *</label>
                          <select
                            id="university"
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            className={`form-input text-[#ededed] bg-[#0e100f] rounded-none ${fieldErrors.institution ? "error" : ""}`}
                            required
                          >
                            <option value="" disabled>Select your university</option>
                            {UNIVERSITIES.map((u) => (
                              <option key={u} value={u} className="bg-[#191919] text-[#ededed]">
                                {u}
                              </option>
                            ))}
                          </select>
                          {fieldErrors.institution && university !== "Other / School Institution" && (
                            <p className="text-red-400 text-xs mt-1">{fieldErrors.institution}</p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <label className="form-label" htmlFor="customInstitution">School Name *</label>
                          <input
                            id="customInstitution"
                            type="text"
                            maxLength={100}
                            value={customInstitution}
                            onChange={(e) => setCustomInstitution(e.target.value)}
                            placeholder="e.g. Richmond College, Galle"
                            className={`form-input rounded-none ${fieldErrors.institution ? "error" : ""}`}
                            required
                          />
                          {fieldErrors.institution && (
                            <p className="text-red-400 text-xs mt-1">{fieldErrors.institution}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {category === "University" && university === "Other / School Institution" && (
                      <div>
                        <label className="form-label" htmlFor="customInstitution">Institution Name *</label>
                        <input
                          id="customInstitution"
                          type="text"
                          maxLength={100}
                          value={customInstitution}
                          onChange={(e) => setCustomInstitution(e.target.value)}
                          placeholder="Enter full institution name"
                          className={`form-input rounded-none ${fieldErrors.institution ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.institution && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.institution}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Section 2: Team Leader Details */}
                  <div className="space-y-4 pt-4 border-t border-[#242622]">
                    <h3 className="font-['Space_Mono',monospace] text-xs font-bold text-[#0ae448] uppercase tracking-wider">
                      02. Team Leader Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" htmlFor="leaderName">Full Name *</label>
                        <input
                          id="leaderName"
                          type="text"
                          maxLength={80}
                          value={leaderName}
                          onChange={(e) => setLeaderName(e.target.value)}
                          placeholder="e.g. Alex Silva"
                          className={`form-input rounded-none ${fieldErrors.leaderName ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.leaderName && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.leaderName}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label" htmlFor="leaderEmail">Email Address *</label>
                        <input
                          id="leaderEmail"
                          type="email"
                          maxLength={254}
                          value={leaderEmail}
                          onChange={(e) => setLeaderEmail(e.target.value)}
                          placeholder="alex@example.com"
                          className={`form-input rounded-none ${fieldErrors.leaderEmail ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.leaderEmail && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.leaderEmail}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" htmlFor="leaderPhone">Contact Number (WhatsApp) *</label>
                        <input
                          id="leaderPhone"
                          type="tel"
                          maxLength={20}
                          value={leaderPhone}
                          onChange={(e) => setLeaderPhone(e.target.value)}
                          placeholder="+94 7X XXX XXXX"
                          className={`form-input rounded-none ${fieldErrors.leaderPhone ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.leaderPhone && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.leaderPhone}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">IEEE Membership</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer h-[42px]">
                            <input
                              type="checkbox"
                              checked={leaderIeee}
                              onChange={(e) => {
                                setLeaderIeee(e.target.checked);
                                if (!e.target.checked) setLeaderIeeeNumber("");
                              }}
                              className="w-4 h-4 accent-[#0ae448] rounded-none cursor-pointer"
                            />
                            <span className="text-xs text-[#bbbaa6]">Leader is an IEEE member</span>
                          </label>
                          {leaderIeee && (
                            <div>
                              <input
                                id="leaderIeeeNumber"
                                type="text"
                                maxLength={15}
                                value={leaderIeeeNumber}
                                onChange={(e) => setLeaderIeeeNumber(e.target.value)}
                                placeholder="Enter IEEE Membership Number"
                                className={`form-input rounded-none ${fieldErrors.leaderIeeeNumber ? "error" : ""}`}
                                required
                              />
                              {fieldErrors.leaderIeeeNumber && (
                                <p className="text-red-400 text-xs mt-1">{fieldErrors.leaderIeeeNumber}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Member 2 Details */}
                  <div className="space-y-4 pt-4 border-t border-[#242622]">
                    <h3 className="font-['Space_Mono',monospace] text-xs font-bold text-[#0ae448] uppercase tracking-wider">
                      03. Member 2 Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" htmlFor="member2Name">Full Name *</label>
                        <input
                          id="member2Name"
                          type="text"
                          maxLength={80}
                          value={member2Name}
                          onChange={(e) => setMember2Name(e.target.value)}
                          placeholder="e.g. Maya Perera"
                          className={`form-input rounded-none ${fieldErrors.member2Name ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.member2Name && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.member2Name}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label" htmlFor="member2Email">Email Address *</label>
                        <input
                          id="member2Email"
                          type="email"
                          maxLength={254}
                          value={member2Email}
                          onChange={(e) => setMember2Email(e.target.value)}
                          placeholder="maya@example.com"
                          className={`form-input rounded-none ${fieldErrors.member2Email ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.member2Email && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.member2Email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" htmlFor="member2Phone">Contact Number (WhatsApp) *</label>
                        <input
                          id="member2Phone"
                          type="tel"
                          maxLength={20}
                          value={member2Phone}
                          onChange={(e) => setMember2Phone(e.target.value)}
                          placeholder="+94 7X XXX XXXX"
                          className={`form-input rounded-none ${fieldErrors.member2Phone ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.member2Phone && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.member2Phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">IEEE Membership</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer h-[42px]">
                            <input
                              type="checkbox"
                              checked={member2Ieee}
                              onChange={(e) => {
                                setMember2Ieee(e.target.checked);
                                if (!e.target.checked) setMember2IeeeNumber("");
                              }}
                              className="w-4 h-4 accent-[#0ae448] rounded-none cursor-pointer"
                            />
                            <span className="text-xs text-[#bbbaa6]">Member 2 is an IEEE member</span>
                          </label>
                          {member2Ieee && (
                            <div>
                              <input
                                id="member2IeeeNumber"
                                type="text"
                                maxLength={15}
                                value={member2IeeeNumber}
                                onChange={(e) => setMember2IeeeNumber(e.target.value)}
                                placeholder="Enter IEEE Membership Number"
                                className={`form-input rounded-none ${fieldErrors.member2IeeeNumber ? "error" : ""}`}
                                required
                              />
                              {fieldErrors.member2IeeeNumber && (
                                <p className="text-red-400 text-xs mt-1">{fieldErrors.member2IeeeNumber}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Member 3 Details */}
                  <div className="space-y-4 pt-4 border-t border-[#242622]">
                    <h3 className="font-['Space_Mono',monospace] text-xs font-bold text-[#0ae448] uppercase tracking-wider">
                      04. Member 3 Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" htmlFor="member3Name">Full Name *</label>
                        <input
                          id="member3Name"
                          type="text"
                          maxLength={80}
                          value={member3Name}
                          onChange={(e) => setMember3Name(e.target.value)}
                          placeholder="e.g. Liam Fernando"
                          className={`form-input rounded-none ${fieldErrors.member3Name ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.member3Name && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.member3Name}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label" htmlFor="member3Email">Email Address *</label>
                        <input
                          id="member3Email"
                          type="email"
                          maxLength={254}
                          value={member3Email}
                          onChange={(e) => setMember3Email(e.target.value)}
                          placeholder="liam@example.com"
                          className={`form-input rounded-none ${fieldErrors.member3Email ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.member3Email && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.member3Email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" htmlFor="member3Phone">Contact Number (WhatsApp) *</label>
                        <input
                          id="member3Phone"
                          type="tel"
                          maxLength={20}
                          value={member3Phone}
                          onChange={(e) => setMember3Phone(e.target.value)}
                          placeholder="+94 7X XXX XXXX"
                          className={`form-input rounded-none ${fieldErrors.member3Phone ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.member3Phone && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.member3Phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">IEEE Membership</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer h-[42px]">
                            <input
                              type="checkbox"
                              checked={member3Ieee}
                              onChange={(e) => {
                                setMember3Ieee(e.target.checked);
                                if (!e.target.checked) setMember3IeeeNumber("");
                              }}
                              className="w-4 h-4 accent-[#0ae448] rounded-none cursor-pointer"
                            />
                            <span className="text-xs text-[#bbbaa6]">Member 3 is an IEEE member</span>
                          </label>
                          {member3Ieee && (
                            <div>
                              <input
                                id="member3IeeeNumber"
                                type="text"
                                maxLength={15}
                                value={member3IeeeNumber}
                                onChange={(e) => setMember3IeeeNumber(e.target.value)}
                                placeholder="Enter IEEE Membership Number"
                                className={`form-input rounded-none ${fieldErrors.member3IeeeNumber ? "error" : ""}`}
                                required
                              />
                              {fieldErrors.member3IeeeNumber && (
                                <p className="text-red-400 text-xs mt-1">{fieldErrors.member3IeeeNumber}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Account Password & Agreement */}
                  <div className="space-y-4 pt-4 border-t border-[#242622]">
                    <h3 className="font-['Space_Mono',monospace] text-xs font-bold text-[#0ae448] uppercase tracking-wider">
                      05. Account Password
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" htmlFor="password">Password (min 8 characters) *</label>
                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            maxLength={128}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className={`form-input pr-12 rounded-none ${fieldErrors.password ? "error" : ""}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-['Space_Mono',monospace] text-[#7c7c6f] hover:text-white uppercase"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        {fieldErrors.password && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label" htmlFor="confirmPassword">Confirm Password *</label>
                        <input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          maxLength={128}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className={`form-input rounded-none ${fieldErrors.confirmPassword ? "error" : ""}`}
                          required
                        />
                        {fieldErrors.confirmPassword && (
                          <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={agreedToRules}
                        onChange={(e) => setAgreedToRules(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#0ae448] cursor-pointer rounded-none"
                        required
                      />
                      <span className="text-xs text-[#bbbaa6] leading-relaxed">
                        I confirm that all team members belong to the specified institution, meet eligibility requirements, and agree to the competition rules.
                      </span>
                    </label>
                    {fieldErrors.agreedToRules && (
                      <p className="text-red-400 text-xs">{fieldErrors.agreedToRules}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-none font-extrabold text-black uppercase tracking-wider font-['Space_Mono',monospace] text-sm shadow-xl hover:brightness-110 transition-all border border-[#0ae448] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: "var(--grad-macha)" }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <span>Complete Registration</span>
                    )}
                  </button>

                  <div className="pt-3 text-center border-t border-[#242622]">
                    <span className="text-xs text-[#7c7c6f]">Already registered? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setView("signin");
                        setFormError(null);
                        setFieldErrors({});
                      }}
                      className="text-xs font-['Space_Mono',monospace] text-[#0ae448] hover:underline font-bold"
                    >
                      Sign In to Team Portal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* View 2: Team Sign In */}
            {view === "signin" && (
              <div className="bg-[#141615] border border-[#242622] p-6 sm:p-8 shadow-xl rounded-none">
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#242622]">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
                      Team Portal Sign In
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setView("register");
                      setSignInError(null);
                    }}
                    className="text-xs font-['Space_Mono',monospace] text-[#0ae448] hover:underline uppercase font-bold"
                  >
                    &larr; Register
                  </button>
                </div>

                {signInError && (
                  <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/60 text-red-400 text-xs rounded-none">
                    {signInError}
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-5" noValidate>
                  <div>
                    <label className="form-label" htmlFor="signInEmail">Team Leader Email</label>
                    <input
                      id="signInEmail"
                      type="email"
                      maxLength={254}
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="leader@example.com"
                      className="form-input rounded-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" htmlFor="signInPassword">Password</label>
                    <input
                      id="signInPassword"
                      type="password"
                      maxLength={128}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Your team password"
                      className="form-input rounded-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full py-3.5 rounded-none font-extrabold text-black uppercase tracking-wider font-['Space_Mono',monospace] text-sm shadow-xl hover:brightness-110 transition-all border border-[#0ae448] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: "var(--grad-macha)" }}
                  >
                    {signInLoading ? "Verifying Credentials..." : "Sign In to Team Portal"}
                  </button>

                  <div className="pt-3 text-center border-t border-[#242622]">
                    <span className="text-xs text-[#7c7c6f]">Need to register a new team? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setView("register");
                        setSignInError(null);
                      }}
                      className="text-xs font-['Space_Mono',monospace] text-[#0ae448] hover:underline font-bold"
                    >
                      Register Team Here
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* View 3: Team Dashboard */}
            {view === "dashboard" && currentTeam && (
              <div className="bg-[#141615] border border-[#242622] p-6 sm:p-8 shadow-xl rounded-none">
                
                {/* Team Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-[#242622]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-['Space_Mono',monospace] text-[#7c7c6f] uppercase">
                        {currentTeam.category} Category
                      </span>
                      <span className="text-[#34352F]">{"//"}</span>
                      <span className="text-xs font-['Space_Mono',monospace] text-[#7c7c6f]">
                        {canonicalizeText(currentTeam.institution)}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
                      Team <span className="text-[#0ae448]">{canonicalizeText(currentTeam.team_name)}</span>
                    </h2>
                  </div>

                  <div>
                    {currentTeam.status === "registered" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-['Space_Mono',monospace] font-bold bg-amber-500/15 border border-amber-500/40 text-amber-400 rounded-none uppercase">
                        <span className="w-1.5 h-1.5 bg-amber-400" />
                        Status: Registered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-['Space_Mono',monospace] font-bold bg-[#0ae448]/15 border border-[#0ae448]/40 text-[#0ae448] rounded-none uppercase">
                        <span className="w-1.5 h-1.5 bg-[#0ae448]" />
                        Status: Qualified
                      </span>
                    )}
                  </div>
                </div>

                {/* Team Roster */}
                <div className="my-6 space-y-3">
                  <h4 className="text-xs font-['Space_Mono',monospace] text-[#7c7c6f] uppercase tracking-wider">
                    Team Members
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-[#0e100f] border border-[#242622] rounded-none">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-['Space_Mono',monospace] text-[#0ae448] uppercase">
                          Leader
                        </span>
                        {currentTeam.leader_ieee_member && (
                          <span className="text-[9px] font-['Space_Mono',monospace] text-[#0ae448] bg-[#0ae448]/10 border border-[#0ae448]/30 px-1.5 py-0.5">
                            IEEE {currentTeam.leader_ieee_number ? `#${canonicalizeText(currentTeam.leader_ieee_number)}` : "MEMBER"}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-white text-sm">{canonicalizeText(currentTeam.leader_name)}</p>
                      <p className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace]">{canonicalizeText(currentTeam.leader_email)}</p>
                      <p className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace]">{canonicalizeText(currentTeam.leader_phone)}</p>
                    </div>

                    <div className="p-3.5 bg-[#0e100f] border border-[#242622] rounded-none">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-['Space_Mono',monospace] text-[#7c7c6f] uppercase">
                          Member 2
                        </span>
                        {currentTeam.member2_ieee && (
                          <span className="text-[9px] font-['Space_Mono',monospace] text-[#0ae448] bg-[#0ae448]/10 border border-[#0ae448]/30 px-1.5 py-0.5">
                            IEEE {currentTeam.member2_ieee_number ? `#${canonicalizeText(currentTeam.member2_ieee_number)}` : "MEMBER"}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-white text-sm">{canonicalizeText(currentTeam.member2_name)}</p>
                      <p className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace]">{canonicalizeText(currentTeam.member2_email)}</p>
                      <p className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace]">{canonicalizeText(currentTeam.member2_phone)}</p>
                    </div>

                    <div className="p-3.5 bg-[#0e100f] border border-[#242622] rounded-none">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-['Space_Mono',monospace] text-[#7c7c6f] uppercase">
                          Member 3
                        </span>
                        {currentTeam.member3_ieee && (
                          <span className="text-[9px] font-['Space_Mono',monospace] text-[#0ae448] bg-[#0ae448]/10 border border-[#0ae448]/30 px-1.5 py-0.5">
                            IEEE {currentTeam.member3_ieee_number ? `#${canonicalizeText(currentTeam.member3_ieee_number)}` : "MEMBER"}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-white text-sm">{canonicalizeText(currentTeam.member3_name)}</p>
                      <p className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace]">{canonicalizeText(currentTeam.member3_email)}</p>
                      <p className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace]">{canonicalizeText(currentTeam.member3_phone)}</p>
                    </div>
                  </div>
                </div>

                {/* Photobooth Status Card */}
                <div className="mt-6 p-5 bg-[#0e100f] border border-[#242622] text-center space-y-3 rounded-none">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white uppercase font-['Space_Mono',monospace]">
                      Photobooth Access Locked
                    </h3>
                    <p className="text-xs text-[#bbbaa6] max-w-md mx-auto leading-relaxed font-['Space_Mono',monospace]">
                      The Virtual Photobooth unlocks strictly after the Online Preliminary Round. Complete the competition round tasks to generate your official HaXtreme 5.0 team pass.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={handleSignOut}
                    className="text-xs font-['Space_Mono',monospace] text-[#7c7c6f] hover:text-red-400 transition-colors uppercase"
                  >
                    &larr; Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Handbook Modal */}
      {isHandbookOpen && (
        <div
          className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-overlay-enter"
          onClick={() => setIsHandbookOpen(false)}
        >
          <div
            className="bg-[#141615] border border-[#242622] max-w-2xl w-full max-h-[85vh] overflow-y-auto modal-scrollbar p-6 sm:p-7 modal-card-enter shadow-2xl relative rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#242622]">
              <h3 className="text-base font-bold text-white uppercase font-['Space_Mono',monospace] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#0ae448]" />
                <span>HaXtreme 5.0 // Handbook</span>
              </h3>
              <button
                onClick={() => setIsHandbookOpen(false)}
                className="w-7 h-7 border border-[#34352F] text-[#bbbaa6] hover:text-white flex items-center justify-center rounded-none"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-[#bbbaa6] leading-relaxed">
              <div>
                <h4 className="font-bold text-xs mb-1 font-['Space_Mono',monospace] text-[#0ae448]">
                  01. Eligibility Criteria
                </h4>
                <p>
                  Teams must strictly consist of three undergraduate students currently enrolled in the same university, or three students from the same school. Cross-institutional teams are not permitted.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs mb-1 font-['Space_Mono',monospace] text-[#0ae448]">
                  02. Online Qualifier Round
                </h4>
                <p>
                  An algorithmic competitive programming contest conducted virtually. All registered teams must participate. Completing at least one task successfully unlocks your official Virtual Photobooth badge and qualifies your team for evaluation into the finals.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs mb-1 font-['Space_Mono',monospace] text-[#0ae448]">
                  03. Final Hackathon Arena
                </h4>
                <p>
                  Top qualifying teams will be invited to the on-site hackathon at the Faculty of Engineering, University of Ruhuna, to build real-world software solutions within the allotted duration.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs mb-1 font-['Space_Mono',monospace] text-[#0ae448]">
                  04. Code of Conduct
                </h4>
                <p>
                  Strict zero-tolerance policy against plagiarism, sharing code across teams, or using unauthorized automated assistance. Automated similarity analysis screens all submissions. Violations lead to immediate disqualification.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#242622] flex justify-end">
              <button
                onClick={() => setIsHandbookOpen(false)}
                className="px-5 py-2 bg-[#0ae448] text-black font-bold text-xs uppercase font-['Space_Mono',monospace] rounded-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
