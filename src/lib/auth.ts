"use client";

export interface TeamMemberSession {
  name: string;
  email: string;
  phone: string;
  isIeeeMember: boolean;
  ieeeNumber?: string;
}

export interface TeamSessionData {
  id?: string;
  teamName: string;
  category: "University" | "School";
  institution: string;
  leader: TeamMemberSession;
  member2: TeamMemberSession;
  member3: TeamMemberSession;
  status: "registered" | "qualified" | "finalist";
  preliminaryRoundCompleted?: boolean;
  hackerrankUsername?: string;
  registeredAt?: string;
}

const STORAGE_KEY = "haxtreme_team_session";
const AUTH_EVENT = "haxtreme-auth-change";

// Helper to normalize legacy flat session formats into full TeamSessionData
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeTeamSession(data: any): TeamSessionData | null {
  if (!data || typeof data !== "object") return null;

  // If already structured with a leader object
  if (data.leader && typeof data.leader === "object") {
    return {
      id: data.id || "",
      teamName: data.teamName || data.team_name || "Team",
      category: data.category || "University",
      institution: data.institution || "",
      leader: {
        name: data.leader.name || data.leader_name || "",
        email: data.leader.email || data.leader_email || "",
        phone: data.leader.phone || data.leader_phone || "",
        isIeeeMember: !!(data.leader.isIeeeMember ?? data.leader.leader_ieee_member ?? data.leader_ieee_member),
        ieeeNumber: data.leader.ieeeNumber || data.leader.leader_ieee_number || data.leader_ieee_number || undefined,
      },
      member2: {
        name: data.member2?.name || data.member2_name || "",
        email: data.member2?.email || data.member2_email || "",
        phone: data.member2?.phone || data.member2_phone || "",
        isIeeeMember: !!(data.member2?.isIeeeMember ?? data.member2?.member2_ieee ?? data.member2_ieee),
        ieeeNumber: data.member2?.ieeeNumber || data.member2?.member2_ieee_number || data.member2_ieee_number || undefined,
      },
      member3: {
        name: data.member3?.name || data.member3_name || "",
        email: data.member3?.email || data.member3_email || "",
        phone: data.member3?.phone || data.member3_phone || "",
        isIeeeMember: !!(data.member3?.isIeeeMember ?? data.member3?.member3_ieee ?? data.member3_ieee),
        ieeeNumber: data.member3?.ieeeNumber || data.member3?.member3_ieee_number || data.member3_ieee_number || undefined,
      },
      status: data.status || "registered",
      preliminaryRoundCompleted: !!data.preliminaryRoundCompleted,
      hackerrankUsername:
        data.hackerrankUsername || data.hackerrank_username || data.hackerrank || undefined,
      registeredAt: data.registeredAt || data.created_at,
    };
  }

  // Handle legacy flat format (team_name, leader_name, leader_email, etc.)
  return {
    id: data.id || "",
    teamName: data.teamName || data.team_name || "Team",
    category: data.category || "University",
    institution: data.institution || "",
    leader: {
      name: data.leader_name || "",
      email: data.leader_email || "",
      phone: data.leader_phone || "",
      isIeeeMember: !!(data.leader_ieee_member || data.leader_ieee),
      ieeeNumber: data.leader_ieee_number || undefined,
    },
    member2: {
      name: data.member2_name || "",
      email: data.member2_email || "",
      phone: data.member2_phone || "",
      isIeeeMember: !!(data.member2_ieee_member || data.member2_ieee),
      ieeeNumber: data.member2_ieee_number || undefined,
    },
    member3: {
      name: data.member3_name || "",
      email: data.member3_email || "",
      phone: data.member3_phone || "",
      isIeeeMember: !!(data.member3_ieee_member || data.member3_ieee),
      ieeeNumber: data.member3_ieee_number || undefined,
    },
    status: data.status || "registered",
    preliminaryRoundCompleted: !!data.preliminaryRoundCompleted,
    hackerrankUsername:
      data.hackerrankUsername || data.hackerrank_username || data.hackerrank || undefined,
    registeredAt: data.created_at || data.registeredAt,
  };
}

export function getTeamSession(): TeamSessionData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const normalized = normalizeTeamSession(parsed);
    if (normalized) {
      // Re-save normalized session so future reads are instantaneous
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch (err) {
    console.error("Failed to read team session:", err);
    return null;
  }
}

export function setTeamSession(team: TeamSessionData): void {
  if (typeof window === "undefined") return;

  try {
    const normalized = normalizeTeamSession(team) || team;
    const serialized = JSON.stringify(normalized);
    localStorage.setItem(STORAGE_KEY, serialized);
    sessionStorage.setItem(STORAGE_KEY, serialized);
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch (err) {
    console.error("Failed to store team session:", err);
  }
}

export function clearTeamSession(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch (err) {
    console.error("Failed to clear team session:", err);
  }
}

export function onAuthChange(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleEvent = () => callback();
  window.addEventListener(AUTH_EVENT, handleEvent);
  window.addEventListener("storage", handleEvent);

  return () => {
    window.removeEventListener(AUTH_EVENT, handleEvent);
    window.removeEventListener("storage", handleEvent);
  };
}
