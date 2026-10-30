"use client";

import { useState } from "react";
import { Plus, X, Loader2, Sparkles, Star, Video, PenLine } from "lucide-react";

interface AddTestimonialModalProps {
  spaceId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTestimonialModal({ spaceId, onClose, onSuccess }: AddTestimonialModalProps) {
  const [type, setType] = useState<"TEXT" | "VIDEO">("TEXT");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [authorSocial, setAuthorSocial] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) {
      setErrorMsg("Please provide author name and testimonial content.");
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
          type,
          rating,
          content,
          authorName,
          authorEmail: authorEmail || `${authorName.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
          authorTitle,
          authorSocial,
          videoUrl: type === "VIDEO" ? (videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4") : null,
          videoDuration: type === "VIDEO" ? 45 : null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create testimonial");
      }

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add testimonial");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">Add Testimonial Manually</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("TEXT")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold border transition-all ${
                  type === "TEXT"
                    ? "bg-slate-800 border-indigo-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                <PenLine className="h-3.5 w-3.5" /> Text Testimonial
              </button>
              <button
                type="button"
                onClick={() => setType("VIDEO")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold border transition-all ${
                  type === "VIDEO"
                    ? "bg-slate-800 border-indigo-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                <Video className="h-3.5 w-3.5" /> Video Testimonial
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Star Rating
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
                    className={`h-5 w-5 ${
                      s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Testimonial Content / Quote <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="What did the customer say?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {type === "VIDEO" && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Video URL (MP4 / WebM / Cloud Storage)
              </label>
              <input
                type="url"
                placeholder="https://.../video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Author Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Alex Rivera"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company / Role
              </label>
              <input
                type="text"
                placeholder="VP of Growth"
                value={authorTitle}
                onChange={(e) => setAuthorTitle(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Save Testimonial</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
