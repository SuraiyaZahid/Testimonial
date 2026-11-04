"use client";

import { useState } from "react";
import { Plus, X, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateSpaceModalProps {
  onClose: () => void;
  onSuccess: (newSpaceSlug: string) => void;
}

export default function CreateSpaceModal({ onClose, onSuccess }: CreateSpaceModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [collectionType, setCollectionType] = useState("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Space name is required");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          headerTitle: headerTitle || `Would you like to give a shoutout for ${name}?`,
          customMessage: customMessage || "We would love to hear your honest feedback. You can record a quick video or drop a few lines!",
          collectionType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create space");
      }

      onSuccess(data.data.slug);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create space");
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
            <h3 className="text-base font-semibold text-white">Create New Testimonial Space</h3>
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
              Space Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acme SaaS Product"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Header Title
            </label>
            <input
              type="text"
              placeholder="e.g. Would you like to give a shoutout for Acme?"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Submission Mode
            </label>
            <select
              value={collectionType}
              onChange={(e) => setCollectionType(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">Both Video and Text (Recommended)</option>
              <option value="VIDEO">Video Only</option>
              <option value="TEXT">Text Only</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating space...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Create Space</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

