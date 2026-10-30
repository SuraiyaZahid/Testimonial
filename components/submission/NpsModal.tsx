"use client";

import { useState } from "react";
import { Smile, Frown, Meh, Heart, X, Sparkles, Loader2, Video } from "lucide-react";

interface NpsModalProps {
  spaceId: string;
  spaceName: string;
  onClose: () => void;
  onPromoteToVideo?: () => void;
}

export default function NpsModal({
  spaceId,
  spaceName,
  onClose,
  onPromoteToVideo,
}: NpsModalProps) {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (score === null) {
      setErrorMsg("Please select a score from 0 to 10.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/nps/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId,
          score,
          feedback,
          authorName,
          authorEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit NPS");
      }

      setSubmittedData(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit score");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <h3 className="text-base font-semibold text-white">Net Promoter Score (NPS)</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!submittedData ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
                  {errorMsg}
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-slate-200 text-center mb-1">
                  How likely are you to recommend <span className="text-indigo-400 font-semibold">{spaceName}</span> to a friend or colleague?
                </p>
                <p className="text-xs text-slate-400 text-center mb-4">
                  (0 = Not at all likely, 10 = Extremely likely)
                </p>

                {/* 0-10 Buttons */}
                <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    let activeBg = "bg-indigo-600 text-white";
                    if (num <= 6) activeBg = "bg-rose-600 text-white";
                    else if (num <= 8) activeBg = "bg-amber-600 text-white";
                    else activeBg = "bg-emerald-600 text-white";

                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setScore(num)}
                        className={`h-10 sm:h-11 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                          score === num
                            ? `${activeBg} shadow-lg scale-105 ring-2 ring-white/20`
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 font-medium mt-1.5 px-1">
                  <span className="flex items-center gap-1">
                    <Frown className="h-3 w-3 text-rose-400" /> Detractor
                  </span>
                  <span className="flex items-center gap-1">
                    <Meh className="h-3 w-3 text-amber-400" /> Passive
                  </span>
                  <span className="flex items-center gap-1">
                    <Smile className="h-3 w-3 text-emerald-400" /> Promoter
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  What is the main reason for your score? (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us what you love or what we can do better..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="Your email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || score === null}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Submit NPS Feedback
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Smile className="h-6 w-6" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Thank you for your feedback!</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {submittedData.nextAction?.message || "Your rating helps us build a better experience for everyone."}
                </p>
              </div>

              {submittedData.nextAction?.action === "PROMPT_VIDEO_REVIEW" && onPromoteToVideo && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onPromoteToVideo();
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 mx-auto px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                  >
                    <Video className="h-4 w-4" />
                    Record a quick 60s video shoutout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
