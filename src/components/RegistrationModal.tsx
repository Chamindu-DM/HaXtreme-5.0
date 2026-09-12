"use client";

import React, { useState, useEffect, useRef } from "react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (teamName: string) => void;
}

interface TeamInfo {
  teamName: string;
  institution: string;
}

interface LeaderDetails {
  name: string;
  email: string;
  phone: string;
}

interface TeamMember {
  id: string; // for local state management
  name: string;
  email: string;
  phone: string;
}

export default function RegistrationModal({ isOpen, onClose, onSuccess }: RegistrationModalProps) {
  const [step, setStep] = useState(1);
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({ teamName: "", institution: "" });
  const [leaderDetails, setLeaderDetails] = useState<LeaderDetails>({ name: "", email: "", phone: "" });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ id: "1", name: "", email: "", phone: "" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap & escape key & body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "Tab" && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;
          
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement || document.activeElement === document.body) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!teamInfo.teamName || teamInfo.teamName.length < 3) {
        newErrors.teamName = "Team name must be at least 3 characters";
      }
      if (!teamInfo.institution) {
        newErrors.institution = "Institution is required";
      }
    } else if (step === 2) {
      if (!leaderDetails.name) newErrors.leaderName = "Leader name is required";
      if (!leaderDetails.email || !validateEmail(leaderDetails.email)) {
        newErrors.leaderEmail = "Valid email is required";
      }
      if (!leaderDetails.phone || leaderDetails.phone.length < 9) {
        newErrors.leaderPhone = "Phone number must be at least 9 digits";
      }
    } else if (step === 3) {
      teamMembers.forEach((member, index) => {
        if (!member.name) newErrors[`memberName_${index}`] = "Name is required";
        if (!member.email || !validateEmail(member.email)) {
          newErrors[`memberEmail_${index}`] = "Valid email is required";
        }
      });
      if (teamMembers.length < 1 || teamMembers.length > 3) {
        newErrors.general = "You must have 1 to 3 additional members";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) setStep(step - 1);
  };

  const handleAddMember = () => {
    if (teamMembers.length < 3) {
      setTeamMembers([...teamMembers, { id: Math.random().toString(), name: "", email: "", phone: "" }]);
    }
  };

  const handleRemoveMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
    }
  };

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        category: "University",
        teamName: teamInfo.teamName,
        institution: teamInfo.institution,
        leaderName: leaderDetails.name,
        leaderEmail: leaderDetails.email,
        leaderPhone: leaderDetails.phone,
        leaderIeee: false,
        member2Name: teamMembers[0]?.name || "Member 2",
        member2Email: teamMembers[0]?.email || "",
        member2Phone: teamMembers[0]?.phone || "",
        member2Ieee: false,
        member3Name: teamMembers[1]?.name || "",
        member3Email: teamMembers[1]?.email || "",
        member3Phone: teamMembers[1]?.phone || "",
        member3Ieee: false,
        password: "DefaultPassword123!",
        agreedToRules: true,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      setIsSuccess(true);
      if (onSuccess) onSuccess(teamInfo.teamName);

    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An error occurred during submission."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map(i => (
        <div 
          key={i} 
          className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-[#0ae448]" : i < step ? "w-2 bg-[#0ae448]/50" : "w-2 bg-[#42433d]"}`} 
        />
      ))}
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-modal-title"
    >
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={() => !isSubmitting && !isSuccess && onClose()} 
        aria-hidden="true"
      />
      
      <div 
        ref={modalRef}
        className="relative bg-[#191919] border border-[#42433d] rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8 transform transition-all"
      >
        {!isSuccess && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-[#bbbaa6] hover:text-white transition-colors p-2"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#0ae448]/20 rounded-full flex items-center justify-center mb-6">
              <svg className="animate-[bounce_1s_ease-in-out_infinite]" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0ae448" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Registration Complete!</h2>
            <p className="text-[#bbbaa6] mb-8">
              Welcome to HaXtreme 5.0, <span className="text-[#0ae448] font-bold">{teamInfo.teamName}</span>!
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-[#0ae448] to-[#abff84] text-black font-bold uppercase tracking-wider rounded-full px-8 py-3 hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 id="registration-modal-title" className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Register for HaXtreme 5.0</h2>
            {renderStepIndicator()}
            
            <div className="min-h-[300px]">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-medium text-white mb-4">Team Information</h3>
                  <div>
                    <label className="block font-['Space_Mono',monospace] text-xs tracking-wider uppercase text-[#bbbaa6] mb-1.5">Team Name *</label>
                    <input 
                      type="text" 
                      value={teamInfo.teamName}
                      onChange={(e) => setTeamInfo({...teamInfo, teamName: e.target.value})}
                      className="w-full bg-[#0e100f] border border-[#42433d] rounded-lg text-white placeholder:text-[#7c7c6f] focus:border-[#0ae448] focus:ring-1 focus:ring-[#0ae448] outline-none px-4 py-3"
                      placeholder="e.g. Byte Bandits"
                    />
                    {errors.teamName && <p className="text-red-400 text-xs mt-1">{errors.teamName}</p>}
                  </div>
                  <div>
                    <label className="block font-['Space_Mono',monospace] text-xs tracking-wider uppercase text-[#bbbaa6] mb-1.5">Institution *</label>
                    <input 
                      type="text" 
                      value={teamInfo.institution}
                      onChange={(e) => setTeamInfo({...teamInfo, institution: e.target.value})}
                      className="w-full bg-[#0e100f] border border-[#42433d] rounded-lg text-white placeholder:text-[#7c7c6f] focus:border-[#0ae448] focus:ring-1 focus:ring-[#0ae448] outline-none px-4 py-3"
                      placeholder="University/College Name"
                    />
                    {errors.institution && <p className="text-red-400 text-xs mt-1">{errors.institution}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-medium text-white mb-4">Leader Details</h3>
                  <div>
                    <label className="block font-['Space_Mono',monospace] text-xs tracking-wider uppercase text-[#bbbaa6] mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      value={leaderDetails.name}
                      onChange={(e) => setLeaderDetails({...leaderDetails, name: e.target.value})}
                      className="w-full bg-[#0e100f] border border-[#42433d] rounded-lg text-white placeholder:text-[#7c7c6f] focus:border-[#0ae448] focus:ring-1 focus:ring-[#0ae448] outline-none px-4 py-3"
                      placeholder="Leader's Name"
                    />
                    {errors.leaderName && <p className="text-red-400 text-xs mt-1">{errors.leaderName}</p>}
                  </div>
                  <div>
                    <label className="block font-['Space_Mono',monospace] text-xs tracking-wider uppercase text-[#bbbaa6] mb-1.5">Email Address *</label>
                    <input 
                      type="email" 
                      value={leaderDetails.email}
                      onChange={(e) => setLeaderDetails({...leaderDetails, email: e.target.value})}
                      className="w-full bg-[#0e100f] border border-[#42433d] rounded-lg text-white placeholder:text-[#7c7c6f] focus:border-[#0ae448] focus:ring-1 focus:ring-[#0ae448] outline-none px-4 py-3"
                      placeholder="leader@example.com"
                    />
                    {errors.leaderEmail && <p className="text-red-400 text-xs mt-1">{errors.leaderEmail}</p>}
                  </div>
                  <div>
                    <label className="block font-['Space_Mono',monospace] text-xs tracking-wider uppercase text-[#bbbaa6] mb-1.5">Phone Number *</label>
                    <input 
                      type="tel" 
                      value={leaderDetails.phone}
                      onChange={(e) => setLeaderDetails({...leaderDetails, phone: e.target.value})}
                      className="w-full bg-[#0e100f] border border-[#42433d] rounded-lg text-white placeholder:text-[#7c7c6f] focus:border-[#0ae448] focus:ring-1 focus:ring-[#0ae448] outline-none px-4 py-3"
                      placeholder="+1234567890"
                    />
                    {errors.leaderPhone && <p className="text-red-400 text-xs mt-1">{errors.leaderPhone}</p>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 animate-in fade-in slide-in-from-right-4 duration-300 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#42433d] [&::-webkit-scrollbar-thumb]:rounded-full">
                  <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#191919] py-2 z-10 border-b border-[#42433d]">
                    <h3 className="text-lg font-medium text-white">Team Members (1-3)</h3>
                    {teamMembers.length < 3 && (
                      <button 
                        onClick={handleAddMember}
                        className="text-xs font-['Space_Mono',monospace] text-[#0ae448] uppercase tracking-wider hover:text-[#abff84] transition-colors"
                        type="button"
                      >
                        + Add Member
                      </button>
                    )}
                  </div>
                  
                  {errors.general && <p className="text-red-400 text-xs mb-2">{errors.general}</p>}

                  {teamMembers.map((member, index) => (
                    <div key={member.id} className="p-4 bg-[#0e100f] rounded-lg border border-[#42433d] mb-4 space-y-3 relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-['Space_Mono',monospace] text-xs text-[#bbbaa6]">MEMBER {index + 1}</span>
                        {teamMembers.length > 1 && (
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                            type="button"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div>
                        <input 
                          type="text" 
                          value={member.name}
                          onChange={(e) => updateMember(member.id, "name", e.target.value)}
                          className="w-full bg-[#191919] border border-[#42433d] rounded-md text-white placeholder:text-[#7c7c6f] focus:border-[#0ae448] focus:ring-1 focus:ring-[#0ae448] outline-none px-3 py-2 text-sm"
                          placeholder="Name *"
                        />
                        {errors[`memberName_${index}`] && <p className="text-red-400 text-xs mt-1">{errors[`memberName_${index}`]}</p>}
                      </div>
                      
                      <div>
                        <input 
                          type="email" 
                          value={member.email}
                          onChange={(e) => updateMember(member.id, "email", e.target.value)}
                          className="w-full bg-[#191919] border border-[#42433d] rounded-md text-white placeholder:text-[#7c7c6f] focus:border-[#0ae448] focus:ring-1 focus:ring-[#0ae448] outline-none px-3 py-2 text-sm"
                          placeholder="Email *"
                        />
                        {errors[`memberEmail_${index}`] && <p className="text-red-400 text-xs mt-1">{errors[`memberEmail_${index}`]}</p>}
                      </div>

                      <div>
                        <input 
                          type="tel" 
                          value={member.phone}
                          onChange={(e) => updateMember(member.id, "phone", e.target.value)}
                          className="w-full bg-[#191919] border border-[#42433d] rounded-md text-white placeholder:text-[#7c7c6f] focus:border-[#0ae448] focus:ring-1 focus:ring-[#0ae448] outline-none px-3 py-2 text-sm"
                          placeholder="Phone (Optional)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-medium text-white mb-4">Review & Submit</h3>
                  
                  {submitError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm mb-4">
                      {submitError}
                    </div>
                  )}

                  <div className="bg-[#0e100f] border border-[#42433d] rounded-lg p-4 space-y-4">
                    <div>
                      <h4 className="font-['Space_Mono',monospace] text-[10px] tracking-wider uppercase text-[#bbbaa6] mb-1">Team</h4>
                      <p className="text-white text-sm">{teamInfo.teamName} <span className="text-[#7c7c6f]">- {teamInfo.institution}</span></p>
                    </div>
                    
                    <div className="h-px bg-[#42433d] w-full" />
                    
                    <div>
                      <h4 className="font-['Space_Mono',monospace] text-[10px] tracking-wider uppercase text-[#bbbaa6] mb-1">Leader</h4>
                      <p className="text-white text-sm">{leaderDetails.name}</p>
                      <p className="text-[#7c7c6f] text-xs">{leaderDetails.email} • {leaderDetails.phone}</p>
                    </div>

                    <div className="h-px bg-[#42433d] w-full" />

                    <div>
                      <h4 className="font-['Space_Mono',monospace] text-[10px] tracking-wider uppercase text-[#bbbaa6] mb-2">Members ({teamMembers.length})</h4>
                      <div className="space-y-2">
                        {teamMembers.map((m) => (
                          <div key={m.id} className="text-sm">
                            <p className="text-white">{m.name}</p>
                            <p className="text-[#7c7c6f] text-xs">{m.email} {m.phone && `• ${m.phone}`}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex-1 border border-[#42433d] text-[#bbbaa6] rounded-full py-3 hover:border-[#0ae448] hover:text-white transition-colors disabled:opacity-50"
                >
                  Back
                </button>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-[2] bg-gradient-to-r from-[#0ae448] to-[#abff84] text-black font-bold uppercase tracking-wider rounded-full py-3 hover:opacity-90 transition-opacity"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-[2] bg-gradient-to-r from-[#0ae448] to-[#abff84] text-black font-bold uppercase tracking-wider rounded-full py-3 hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Submitting...
                    </>
                  ) : "Submit Registration"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
