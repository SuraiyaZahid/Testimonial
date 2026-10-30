"use client";

import { useState } from "react";
import { MessageSquare, Plus, ExternalLink, Heart, Sparkles, Loader2, X } from "lucide-react";
import { TwitterIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { formatDate } from "@/lib/utils";

interface BrandMentionsViewProps {
  spaceId: string;
  testimonials: any[];
  onRefresh: () => void;
  onToggleFeatured: (id: string, current: boolean) => void;
}

export default function BrandMentionsView({
  spaceId,
  testimonials,
  onRefresh,
  onToggleFeatured,
}: BrandMentionsViewProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [platform, setPlatform] = useState<"TWITTER" | "LINKEDIN" | "REDDIT">("TWITTER");
  const [authorName, setAuthorName] = useState("");
  const [authorSocial, setAuthorSocial] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [content, setContent] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const socialMentions = testimonials.filter(
    (t) => t.source === "TWITTER" || t.source === "LINKEDIN" || t.source === "REDDIT"
  );

  async function handleImportSocial(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) {
      setErrorMsg("Please provide author name and post content.");
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
          rating: 5,
          content,
          authorName,
          authorEmail: `${authorName.toLowerCase().replace(/[^a-z0-9]/g, "")}@socialproof.io`,
          authorTitle: platform === "TWITTER" ? `Indie Hacker (@${authorSocial.replace('@', '')})` : "Industry Professional",
          authorSocial,
          source: platform,
          sourceUrl: sourceUrl || `https://${platform.toLowerCase()}.com/post`,
          authorAvatar: authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=0284c7`,
          tags: `${platform}, Social Proof`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to import social mention");
      }

      setShowImportModal(false);
      setContent("");
      setAuthorName("");
      setAuthorSocial("");
      setSourceUrl("");
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to import");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-400">
            <TwitterIcon className="h-3.5 w-3.5" />
            <span>PRD 4.2 Brand Monitoring & Social Proof</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Import External Social Mentions</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Aggregate viral mentions, tweets, and LinkedIn shoutouts into your Wall of Love. Turn casual praise into lasting social proof.
          </p>
        </div>

        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Import Social Mention</span>
        </button>
      </div>

      {/* Social Mentions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialMentions.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm transition-all hover:border-slate-700 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  {m.source === "TWITTER" && (
                    <span className="flex items-center gap-1 text-sky-400">
                      <TwitterIcon className="h-4 w-4" />
                      Twitter / X Post
                    </span>
                  )}
                  {m.source === "LINKEDIN" && (
                    <span className="flex items-center gap-1 text-blue-500">
                      <LinkedinIcon className="h-4 w-4" />
                      LinkedIn Post
                    </span>
                  )}
                  {m.source === "REDDIT" && (
                    <span className="flex items-center gap-1 text-orange-500">
                      <MessageSquare className="h-4 w-4" />
                      Reddit Mention
                    </span>
                  )}
                </span>

                <button
                  onClick={() => onToggleFeatured(m.id, m.isFeatured)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    m.isFeatured
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400"
                  }`}
                  title={m.isFeatured ? "Featured on Wall of Love" : "Feature on Wall"}
                >
                  <Heart className={`h-3.5 w-3.5 ${m.isFeatured ? "fill-rose-400" : ""}`} />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                "{m.content}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={
                    m.authorAvatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      m.authorName
                    )}&backgroundColor=0284c7`
                  }
                  alt={m.authorName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <h5 className="text-xs font-semibold text-white truncate">
                    {m.authorName}
                  </h5>
                  <p className="text-[11px] text-slate-400 truncate">
                    {m.authorSocial || m.authorTitle}
                  </p>
                </div>
              </div>

              {m.sourceUrl && (
                <a
                  href={m.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                  title="View original post"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {socialMentions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <TwitterIcon className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white">No social mentions imported yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Click "Import Social Mention" to paste posts from Twitter, LinkedIn, or Reddit.
          </p>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h3 className="text-base font-semibold text-white">Import Social Proof Mention</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleImportSocial} className="p-6 space-y-4">
              {errorMsg && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Source Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "TWITTER", label: "Twitter / X" },
                    { id: "LINKEDIN", label: "LinkedIn" },
                    { id: "REDDIT", label: "Reddit" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id as any)}
                      className={`rounded-xl py-2 text-xs font-semibold border transition-all ${
                        platform === p.id
                          ? "bg-slate-800 border-indigo-500 text-white"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Post Content / Text <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Paste what the customer said..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Author Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam O'Connor"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Social Handle
                  </label>
                  <input
                    type="text"
                    placeholder="@liam_builds"
                    value={authorSocial}
                    onChange={(e) => setAuthorSocial(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Original Post URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://x.com/.../status/..."
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Save to Social Proof Wall</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
