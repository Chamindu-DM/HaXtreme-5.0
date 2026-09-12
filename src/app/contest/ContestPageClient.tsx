"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getTeamSession,
  setTeamSession,
  clearTeamSession,
  TeamSessionData,
} from "@/lib/auth";
import { validateEmail, canonicalizeText } from "@/lib/security";

const HACKERRANK_CONTEST_URL =
  process.env.NEXT_PUBLIC_HACKERRANK_CONTEST_URL ||
  "https://www.hackerrank.com/haxtreme-5-0";

const OC_CONTACT_EMAIL = "info.haxtreme@gmail.com";

// Official contest start time: October 3, 2026 09:00:00 AM Sri Lanka Time (UTC+05:30)
const CONTEST_START_TIMESTAMP = new Date("2026-10-03T09:00:00+05:30").getTime();

export default function ContestPageClient() {
  const router = useRouter();
  const [team, setTeam] = useState<TeamSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sign in state (for unauthenticated visitors)
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // HackerRank team account state
  const [hrInput, setHrInput] = useState("");
  const [isEditingHr, setIsEditingHr] = useState(false);
  const [isSavingHr, setIsSavingHr] = useState(false);
  const [hrError, setHrError] = useState<string | null>(null);
  const [hrSuccess, setHrSuccess] = useState<string | null>(null);

  const isContestActive = Date.now() >= CONTEST_START_TIMESTAMP;

  useEffect(() => {
    const session = getTeamSession();
    setTeam(session);
    if (session?.hackerrankUsername) {
      setHrInput(session.hackerrankUsername);
    }
    setIsLoading(false);
  }, []);

  const handleSignOut = () => {
    clearTeamSession();
    setTeam(null);
    router.push("/register");
  };

  const handleSaveHackerRank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;

    const trimmed = hrInput.trim();
    if (!trimmed) {
      setHrError("Please enter your team's HackerRank username.");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]{2,50}$/;
    if (!usernameRegex.test(trimmed)) {
      setHrError("Must be 2-50 characters containing letters, numbers, hyphens, or underscores.");
      return;
    }

    if (isContestActive) {
      setHrError("The contest has commenced. HackerRank username is locked and cannot be changed.");
      return;
    }

    setIsSavingHr(true);
    setHrError(null);
    setHrSuccess(null);

    try {
      const res = await fetch("/api/team/hackerrank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: team.id,
          email: team.leader?.email,
          hackerrankUsername: trimmed,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setHrError(data.error || "Failed to register HackerRank username.");
        return;
      }

      const updated: TeamSessionData = {
        ...team,
        hackerrankUsername: trimmed,
      };
      setTeam(updated);
      setTeamSession(updated);
      setIsEditingHr(false);
      setHrSuccess("HackerRank username successfully registered for your team.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to connect to server.";
      setHrError(msg);
    } finally {
      setIsSavingHr(false);
    }
  };

  // Direct login for unauthenticated visitors on /contest
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

      setTeamSession(resData.team);
      setTeam(resData.team);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Sign in failed.";
      setSignInError(errorMsg);
    } finally {
      setSignInLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E100F] text-white">
        <div className="flex items-center gap-3 text-xs font-['Space_Mono',monospace] text-[#bbbaa6]">
          <span className="w-2 h-2 bg-[#0ae448] animate-ping" />
          <span>LOADING CONTEST PORTAL...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0E100F] text-[#ededed] font-['Helvetica_Neue','Inter',sans-serif] selection:bg-[#0ae448] selection:text-black relative">
      <Navbar />

      {/* Top Header Banner */}
      <section className="w-full pt-16 pb-8 px-4 sm:px-6 lg:px-0 border-b border-[#242622] bg-[#0E100F]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 bg-[#0ae448]" />
              <span className="text-xs font-['Space_Mono',monospace] text-[#7c7c6f] uppercase tracking-wider">
                HaXtreme 5.0 // Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase">
              Contest <span className="text-[#0ae448]">Hub</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#34352F] text-xs font-['Space_Mono',monospace] uppercase text-[#bbbaa6] hover:text-[#0ae448] hover:border-[#0ae448] transition-colors rounded-none"
            >
              <span>Home</span>
            </Link>

            {team && (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-red-500/30 text-xs font-['Space_Mono',monospace] uppercase text-red-400 hover:bg-red-500/10 transition-colors rounded-none"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-10">
        {!team ? (
          /* Unauthenticated Fallback Card */
          <div className="max-w-md mx-auto bg-[#141615] border border-[#242622] p-6 sm:p-8 shadow-2xl rounded-none">
            <div className="mb-6">
              <span className="text-xs font-['Space_Mono',monospace] text-[#0ae448] uppercase tracking-wider block mb-1">
                Access Required
              </span>
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                Sign In to Contest
              </h2>
              <p className="text-xs text-[#bbbaa6] mt-2 font-['Space_Mono',monospace] leading-relaxed">
                Enter your registered team leader credentials to access the contest arena and team roster.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-['Space_Mono',monospace] text-[#bbbaa6] uppercase tracking-wider mb-1.5">
                  Leader Email Address
                </label>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="leader@domain.com"
                  className="w-full bg-[#0e100f] border border-[#34352F] rounded-none px-4 py-3 text-white text-xs font-['Space_Mono',monospace] focus:border-[#0ae448] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-['Space_Mono',monospace] text-[#bbbaa6] uppercase tracking-wider mb-1.5">
                  Account Password
                </label>
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Password set during registration"
                  className="w-full bg-[#0e100f] border border-[#34352F] rounded-none px-4 py-3 text-white text-xs font-['Space_Mono',monospace] focus:border-[#0ae448] outline-none"
                  required
                />
              </div>

              {signInError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-['Space_Mono',monospace] rounded-none">
                  [ERROR]: {signInError}
                </div>
              )}

              <button
                type="submit"
                disabled={signInLoading}
                className="w-full py-3.5 bg-[#0ae448] hover:brightness-110 text-black font-extrabold uppercase tracking-wider text-xs font-['Space_Mono',monospace] transition-all rounded-none disabled:opacity-50"
              >
                {signInLoading ? "Verifying Credentials..." : "Sign In to Portal"}
              </button>

              <div className="pt-4 border-t border-[#242622] text-center">
                <span className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace]">
                  Haven&apos;t registered your team yet?{" "}
                </span>
                <Link
                  href="/register"
                  className="text-xs font-['Space_Mono',monospace] text-[#0ae448] hover:underline font-bold"
                >
                  Register Team Here
                </Link>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Team Contest Portal */
          <div className="space-y-8">
            {/* Team Header Bar */}
            <div className="bg-[#141615] border border-[#242622] p-6 sm:p-8 rounded-none">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#242622]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-['Space_Mono',monospace] text-[#0ae448] uppercase tracking-wider">
                      {team.category} Category
                    </span>
                    <span className="text-[#34352F]">{"//"}</span>
                    <span className="text-xs font-['Space_Mono',monospace] text-[#7c7c6f]">
                      {canonicalizeText(team.institution)}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
                    Team <span className="text-[#0ae448]">{canonicalizeText(team.teamName)}</span>
                  </h2>
                </div>

                <div>
                  {team.status === "registered" ? (
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-['Space_Mono',monospace] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-none uppercase">
                      <span className="w-1.5 h-1.5 bg-amber-400 animate-pulse" />
                      Status: Registered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-['Space_Mono',monospace] font-bold bg-[#0ae448]/10 border border-[#0ae448]/30 text-[#0ae448] rounded-none uppercase">
                      <span className="w-1.5 h-1.5 bg-[#0ae448]" />
                      Status: Qualified
                    </span>
                  )}
                </div>
              </div>

              {/* HackerRank Contest Arena Card */}
              <div className="pt-6 space-y-4">
                <div className="p-6 bg-[#0e100f] border border-[#242622] rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#0ae448]" />
                      <h3 className="text-base font-bold text-white uppercase font-['Space_Mono',monospace]">
                        Online Preliminary Round Arena
                      </h3>
                    </div>
                    <p className="text-xs text-[#bbbaa6] leading-relaxed font-['Space_Mono',monospace]">
                      The official competitive programming round is hosted on HackerRank. All members of the team must compete using only ONE shared HackerRank account.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] font-['Space_Mono',monospace] text-[#7c7c6f]">
                      <span>[PLATFORM]: HackerRank</span>
                      <span>[DURATION]: 4 Hours</span>
                      <span>[LANGUAGES]: C, C++, Java, Python, JS</span>
                    </div>
                  </div>

                  {/* Decent looking Enter Contest button */}
                  <div className="shrink-0 w-full md:w-auto">
                    <a
                      href={HACKERRANK_CONTEST_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#141615] hover:bg-[#1a1d1b] border-2 border-[#0ae448] text-white font-bold text-xs uppercase font-['Space_Mono',monospace] tracking-wider transition-all duration-300 shadow-lg shadow-green-500/10 hover:shadow-green-500/20 w-full md:w-auto rounded-none text-center"
                    >
                      <span className="text-[#0ae448] group-hover:text-white transition-colors">
                        Enter Contest
                      </span>
                      <svg
                        className="w-4 h-4 text-[#0ae448] group-hover:text-white group-hover:translate-x-1 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Team Shared HackerRank Account Card */}
                <div className="p-6 bg-[#0e100f] border border-[#242622] rounded-none space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#242622]">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase font-['Space_Mono',monospace] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#0ae448]" />
                        <span>Team HackerRank Account</span>
                      </h4>
                      <p className="text-[11px] text-[#7c7c6f] font-['Space_Mono',monospace] mt-1">
                        All members of the team use only one HackerRank account. Must be entered before contest and cannot be changed during contest.
                      </p>
                    </div>

                    <div>
                      {isContestActive ? (
                        <span className="text-[10px] font-['Space_Mono',monospace] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-none uppercase">
                          Contest Active // Locked
                        </span>
                      ) : team.hackerrankUsername && !isEditingHr ? (
                        <span className="text-[10px] font-['Space_Mono',monospace] text-[#0ae448] bg-[#0ae448]/10 border border-[#0ae448]/30 px-2.5 py-1 rounded-none uppercase">
                          Handle Saved
                        </span>
                      ) : (
                        <span className="text-[10px] font-['Space_Mono',monospace] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-none uppercase">
                          Pending Submission
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Registered State Display */}
                  {team.hackerrankUsername && !isEditingHr ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#141615] border border-[#242622]">
                      <div className="space-y-1">
                        <span className="text-[10px] font-['Space_Mono',monospace] text-[#7c7c6f] uppercase tracking-wider block">
                          Official Team Handle
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold font-['Space_Mono',monospace] text-[#0ae448]">
                            @{team.hackerrankUsername}
                          </span>
                          <a
                            href={`https://www.hackerrank.com/profile/${encodeURIComponent(team.hackerrankUsername)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#bbbaa6] hover:text-white underline font-['Space_Mono',monospace]"
                          >
                            (Verify on HackerRank)
                          </a>
                        </div>
                      </div>

                      {!isContestActive ? (
                        <button
                          type="button"
                          onClick={() => {
                            setHrInput(team.hackerrankUsername || "");
                            setIsEditingHr(true);
                            setHrError(null);
                            setHrSuccess(null);
                          }}
                          className="px-4 py-2 border border-[#34352F] hover:border-[#0ae448] text-xs font-['Space_Mono',monospace] text-[#bbbaa6] hover:text-white uppercase transition-colors rounded-none"
                        >
                          Change Username
                        </button>
                      ) : (
                        <div className="text-[11px] font-['Space_Mono',monospace] text-[#7c7c6f]">
                          [LOCKED DURING CONTEST]
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Entry / Edit Form */
                    <form onSubmit={handleSaveHackerRank} className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-['Space_Mono',monospace] text-[#7c7c6f]">
                            @
                          </span>
                          <input
                            type="text"
                            value={hrInput}
                            onChange={(e) => setHrInput(e.target.value.trim())}
                            disabled={isSavingHr || isContestActive}
                            placeholder="hackerrank_username"
                            className="w-full bg-[#141615] border border-[#34352F] rounded-none pl-8 pr-4 py-2.5 text-white text-xs font-['Space_Mono',monospace] focus:border-[#0ae448] outline-none disabled:opacity-50"
                            required
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="submit"
                            disabled={isSavingHr || isContestActive || !hrInput.trim()}
                            className="px-6 py-2.5 bg-[#0ae448] hover:brightness-110 text-black font-extrabold uppercase tracking-wider text-xs font-['Space_Mono',monospace] transition-all rounded-none disabled:opacity-40"
                          >
                            {isSavingHr ? "Saving..." : "Save Username"}
                          </button>

                          {team.hackerrankUsername && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingHr(false);
                                setHrInput(team.hackerrankUsername || "");
                                setHrError(null);
                              }}
                              className="px-4 py-2.5 border border-[#34352F] text-xs font-['Space_Mono',monospace] text-[#bbbaa6] hover:text-white uppercase transition-colors rounded-none"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      {hrError && (
                        <p className="text-xs text-red-400 font-['Space_Mono',monospace]">
                          [ERROR]: {hrError}
                        </p>
                      )}

                      {hrSuccess && (
                        <p className="text-xs text-[#0ae448] font-['Space_Mono',monospace]">
                          [SUCCESS]: {hrSuccess}
                        </p>
                      )}

                      <p className="text-[11px] text-[#7c7c6f] font-['Space_Mono',monospace] leading-relaxed">
                        Important: All 3 team members must submit answers using this single account. Handle modification will be permanently disabled once the contest begins.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Locked Team Roster Section */}
            <div className="bg-[#141615] border border-[#242622] p-6 sm:p-8 rounded-none space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#242622]">
                <div>
                  <h3 className="text-base font-bold text-white uppercase font-['Space_Mono',monospace]">
                    Verified Team Roster
                  </h3>
                  <span className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace]">
                    Official registered roster for HaXtreme 5.0
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-[#191b19] border border-[#34352F] text-[11px] font-['Space_Mono',monospace] text-[#bbbaa6] rounded-none">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>ROSTER LOCKED</span>
                </div>
              </div>

              {/* Warning Notice on Team Changes */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-amber-400 font-['Space_Mono',monospace] uppercase">
                      [IMPORTANT]: Team Roster Locked
                    </h4>
                    <p className="text-xs text-[#bbbaa6] font-['Space_Mono',monospace] leading-relaxed">
                      Participants cannot change team members after registration. If any information needs to be corrected or updated, you must contact an Organizing Committee (OC) member directly.
                    </p>
                  </div>

                  <a
                    href={`mailto:${OC_CONTACT_EMAIL}?subject=HaXtreme%205.0%20-%20Team%20Details%20Update%20Request%20(${encodeURIComponent(
                      team.teamName
                    )})`}
                    className="shrink-0 px-4 py-2 border border-amber-500/50 hover:bg-amber-500/20 text-amber-400 font-bold text-xs uppercase font-['Space_Mono',monospace] transition-colors rounded-none text-center"
                  >
                    Contact OC Member
                  </a>
                </div>
              </div>

              {/* 3 Team Member Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Leader */}
                <div className="p-5 bg-[#0e100f] border border-[#242622] rounded-none space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-['Space_Mono',monospace] text-[#0ae448] uppercase">
                      Team Leader
                    </span>
                    {team.leader?.isIeeeMember && (
                      <span className="text-[10px] font-['Space_Mono',monospace] text-[#0ae448] bg-[#0ae448]/10 border border-[#0ae448]/30 px-2 py-0.5 rounded-none">
                        IEEE {team.leader.ieeeNumber ? `#${canonicalizeText(team.leader.ieeeNumber)}` : "MEMBER"}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-white text-base">{canonicalizeText(team.leader?.name || "Leader")}</p>
                  <div className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace] space-y-0.5 pt-1">
                    <p className="truncate">Email: {canonicalizeText(team.leader?.email || "—")}</p>
                    <p>Phone: {canonicalizeText(team.leader?.phone || "—")}</p>
                  </div>
                </div>

                {/* Member 2 */}
                <div className="p-5 bg-[#0e100f] border border-[#242622] rounded-none space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-['Space_Mono',monospace] text-[#7c7c6f] uppercase">
                      Member 02
                    </span>
                    {team.member2?.isIeeeMember && (
                      <span className="text-[10px] font-['Space_Mono',monospace] text-[#0ae448] bg-[#0ae448]/10 border border-[#0ae448]/30 px-2 py-0.5 rounded-none">
                        IEEE {team.member2.ieeeNumber ? `#${canonicalizeText(team.member2.ieeeNumber)}` : "MEMBER"}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-white text-base">{canonicalizeText(team.member2?.name || "Member 2")}</p>
                  <div className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace] space-y-0.5 pt-1">
                    <p className="truncate">Email: {canonicalizeText(team.member2?.email || "—")}</p>
                    <p>Phone: {canonicalizeText(team.member2?.phone || "—")}</p>
                  </div>
                </div>

                {/* Member 3 */}
                <div className="p-5 bg-[#0e100f] border border-[#242622] rounded-none space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-['Space_Mono',monospace] text-[#7c7c6f] uppercase">
                      Member 03
                    </span>
                    {team.member3?.isIeeeMember && (
                      <span className="text-[10px] font-['Space_Mono',monospace] text-[#0ae448] bg-[#0ae448]/10 border border-[#0ae448]/30 px-2 py-0.5 rounded-none">
                        IEEE {team.member3.ieeeNumber ? `#${canonicalizeText(team.member3.ieeeNumber)}` : "MEMBER"}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-white text-base">{canonicalizeText(team.member3?.name || "Member 3")}</p>
                  <div className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace] space-y-0.5 pt-1">
                    <p className="truncate">Email: {canonicalizeText(team.member3?.email || "—")}</p>
                    <p>Phone: {canonicalizeText(team.member3?.phone || "—")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Virtual Photobooth Card (Strictly Locked Until Preliminary Round) */}
            <div className="bg-[#141615] border border-[#242622] p-6 sm:p-8 rounded-none space-y-4">
              <div className="pb-4 border-b border-[#242622] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white uppercase font-['Space_Mono',monospace]">
                    Virtual Photobooth
                  </h3>
                  <span className="text-xs text-[#7c7c6f] font-['Space_Mono',monospace]">
                    Generate your official HaXtreme 5.0 team badge
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-['Space_Mono',monospace] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-none uppercase flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Locked</span>
                  </span>
                </div>
              </div>

              <div className="p-5 bg-[#0e100f] border border-[#242622] text-center space-y-3 rounded-none">
                <h4 className="text-xs font-bold text-white uppercase font-['Space_Mono',monospace]">
                  Access Locked Until Round Completion
                </h4>
                <p className="text-xs text-[#bbbaa6] font-['Space_Mono',monospace] max-w-lg mx-auto leading-relaxed">
                  The Virtual Photobooth unlocks strictly after the conclusion of the Online Preliminary Round. Complete the competition round tasks to generate your official HaXtreme 5.0 team pass.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
