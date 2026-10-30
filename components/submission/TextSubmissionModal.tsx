"use client";

import { useState } from "react";
import { Star, MessageSquare, X, Loader2, Sparkles, User, HelpCircle } from "lucide-react";

interface TextSubmissionModalProps {
  spaceId: string;
  spaceName: string;
  primaryColor?: string;
  questions?: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function TextSubmissionModal({
  spaceId,
  spaceName,
  primaryColor = "#5D5FEF",
  questions = [],
  onClose,
  onSuccess,
}: TextSubmissionModalProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [authorSocial, setAuthorSocial] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPrompts, setShowPrompts] = useState(true);

  // Preset avatars for reviewers
  const avatarOptions = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMsg("Please write your testimonial content.");
      return;
    }
    if (!authorName.trim() || !authorEmail.trim()) {
      setErrorMsg("Please provide your name and email.");
      return;
    }
    if (!consent) {
      setErrorMsg("Please accept the permission checkbox to proceed.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId,
          type: "TEXT",
          rating,
          content,
          authorName,
          authorEmail,
          authorTitle,
          authorSocial,
          authorAvatar: authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=5d5fef`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed");
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Write Text Testimonial</h3>
              <p className="text-xs text-slate-400">For {spaceName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Star Rating */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-6 w-6 ${
                      s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-slate-400 ml-2 font-medium">
                {rating} out of 5 stars
              </span>
            </div>
          </div>

          {/* Guiding Questions Helper */}
          {questions && questions.length > 0 && (
            <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Need inspiration? What to mention:
                </span>
                <button
                  type="button"
                  onClick={() => setShowPrompts(!showPrompts)}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {showPrompts ? "Hide" : "Show"}
                </button>
              </div>
              {showPrompts && (
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                  {questions.map((q, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {q}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Review Textarea */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Your Review <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="What do you like best? What results or changes did you see?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Author Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Title / Company
              </label>
              <input
                type="text"
                placeholder="Founder & CEO @ Startup"
                value={authorTitle}
                onChange={(e) => setAuthorTitle(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Social Handle or Website
              </label>
              <input
                type="text"
                placeholder="@janedoe or linkedin.com/in/..."
                value={authorSocial}
                onChange={(e) => setAuthorSocial(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Avatar Photo (Optional)
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {avatarOptions.map((av, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAuthorAvatar(av)}
                    className={`h-9 w-9 rounded-full overflow-hidden border-2 transition-all ${
                      authorAvatar === av ? "border-indigo-500 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={av} alt="Avatar option" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or paste avatar image URL"
                value={authorAvatar}
                onChange={(e) => setAuthorAvatar(e.target.value)}
                className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
              />
              <span className="text-xs text-slate-400 leading-relaxed">
                I give permission to use this testimonial on your website, marketing channels, and social media.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting review...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
