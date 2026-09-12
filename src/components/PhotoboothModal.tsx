"use client";

import React, { useState, useEffect } from 'react';
import Photobooth from './Photobooth';

interface PhotoboothModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoboothModal({ isOpen, onClose }: PhotoboothModalProps) {
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedTeamName, setVerifiedTeamName] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'info' | 'success' } | null>(null);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEmail('');
        setVerifiedTeamName(null);
        setParticipantName(null);
        setMessage(null);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ text: 'Please enter an email address.', type: 'error' });
      return;
    }

    setIsVerifying(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({
          text: data.error || 'No registration found with this email.',
          type: 'error',
        });
        return;
      }

      if (data.qualified) {
        setVerifiedTeamName(data.teamName);
        setParticipantName(data.participantName);
      } else {
        setMessage({
          text: "Your team hasn't qualified yet. Complete at least one task in the online round to unlock the photobooth.",
          type: 'info',
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage({ text: "An error occurred during verification. Please try again.", type: 'error' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[#191919] border border-[#42433d] rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#bbbaa6] hover:text-white rounded-none bg-black/20 hover:bg-black/40 transition-colors border border-[#42433d]"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          {!verifiedTeamName ? (
            <div className="flex flex-col items-center text-center space-y-6 py-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 uppercase font-['Space_Mono',monospace]">Virtual Photobooth</h2>
                <p className="text-[#bbbaa6] text-xs font-['Space_Mono',monospace]">Enter your registered leader email to access the photobooth</p>
              </div>

              <form onSubmit={handleVerify} className="w-full max-w-sm space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="leader@example.com"
                    className="w-full bg-[#0E100F] border border-[#42433d] rounded-none px-4 py-3 text-white placeholder-[#bbbaa6]/50 focus:outline-none focus:border-[#0ae448] transition-colors font-['Space_Mono',monospace] text-xs"
                    required
                  />
                </div>

                {message && (
                  <div className={`p-3 rounded-none text-xs text-left border font-['Space_Mono',monospace] ${
                    message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                    message.type === 'info' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    'bg-green-500/10 border-green-500/30 text-green-400'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-none font-extrabold text-black uppercase tracking-wider text-xs font-['Space_Mono',monospace] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-500/20 transition-all border border-[#0ae448] flex items-center justify-center gap-2"
                  style={{ background: "var(--grad-macha)" }}
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying Access...
                    </>
                  ) : (
                    'Verify Access'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <button 
                onClick={() => setVerifiedTeamName(null)}
                className="mb-6 self-start flex items-center text-sm font-['Space_Mono',monospace] text-[#bbbaa6] hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                BACK
              </button>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white">Your Pass</h3>
                <p className="text-[#bbbaa6] text-sm mt-1">Team {verifiedTeamName}</p>
              </div>

              <Photobooth 
                teamName={verifiedTeamName} 
                participantName={participantName || undefined} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
