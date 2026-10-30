"use client";

import { useState } from "react";
import { Star, Video, PenLine, Heart, Search, Filter, Trash2, Sparkles, FileText, ExternalLink, Play, CheckCircle2, MessageSquare } from "lucide-react";
import { TwitterIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { formatDate } from "@/lib/utils";

interface InboxTestimonialsViewProps {
  testimonials: any[];
  onToggleFeatured: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onGenerateTranscript: (id: string) => void;
  onGenerateCaseStudy: (testimonial: any) => void;
}

export default function InboxTestimonialsView({
  testimonials,
  onToggleFeatured,
  onDelete,
  onGenerateTranscript,
  onGenerateCaseStudy,
}: InboxTestimonialsViewProps) {
  const [filterType, setFilterType] = useState<"ALL" | "VIDEO" | "TEXT">("ALL");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "ALL">("ALL");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Filter testimonials
  const filtered = testimonials.filter((t) => {
    if (filterType !== "ALL" && t.type !== filterType) return false;
    if (featuredOnly && !t.isFeatured) return false;
    if (ratingFilter !== "ALL" && t.rating !== ratingFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.authorName?.toLowerCase().includes(q);
      const matchContent = t.content?.toLowerCase().includes(q);
      const matchCompany = t.authorTitle?.toLowerCase().includes(q);
      const matchTranscript = t.transcript?.toLowerCase().includes(q);
      if (!matchName && !matchContent && !matchCompany && !matchTranscript) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by author, company, quote, transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex rounded-xl bg-slate-950 border border-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setFilterType("ALL")}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                filterType === "ALL" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              All ({testimonials.length})
            </button>
            <button
              onClick={() => setFilterType("VIDEO")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                filterType === "VIDEO" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              Videos
            </button>
            <button
              onClick={() => setFilterType("TEXT")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                filterType === "TEXT" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <PenLine className="h-3.5 w-3.5" />
              Texts
            </button>
          </div>

          {/* Featured Only Toggle */}
          <button
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
              featuredOnly
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${featuredOnly ? "fill-rose-400" : ""}`} />
            <span>Featured on Wall</span>
          </button>

          {/* Star Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
            className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Stars</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
          </select>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((t) => {
          const isVideo = t.type === "VIDEO" && t.videoUrl;

          return (
            <div
              key={t.id}
              className="relative rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm transition-all hover:border-slate-700 flex flex-col justify-between"
            >
              <div>
                {/* Top header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        t.type === "VIDEO"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {t.type === "VIDEO" ? <Video className="h-3 w-3" /> : <PenLine className="h-3 w-3" />}
                      {t.type}
                    </span>

                    {/* Star rating */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= t.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                          }`}
                        />
                      ))}
                    </div>

                    {t.source === "TWITTER" && <TwitterIcon className="h-3.5 w-3.5 text-sky-400" />}
                    {t.source === "LINKEDIN" && <LinkedinIcon className="h-3.5 w-3.5 text-blue-500" />}
                  </div>

                  {/* Actions: Heart / Feature button */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFeatured(t.id, t.isFeatured)}
                      title={t.isFeatured ? "Featured on Wall of Love" : "Click to feature on Wall"}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        t.isFeatured
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                          : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-rose-400"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${t.isFeatured ? "fill-rose-400" : ""}`} />
                    </button>

                    <button
                      onClick={() => onDelete(t.id)}
                      title="Delete testimonial"
                      className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Video Preview (if video review) */}
                {isVideo && (
                  <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-black border border-slate-800">
                    <video
                      src={t.videoUrl}
                      controls
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Content / Quote */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
                  "{t.content}"
                </p>

                {/* AI Transcript Drawer / Trigger (PRD 4.4) */}
                {t.transcript ? (
                  <div className="mb-4 rounded-xl bg-slate-950/70 border border-slate-800/80 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 mb-1">
                      <Sparkles className="h-3 w-3" />
                      <span>AI Speech-to-Text Transcript:</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      {t.transcript}
                    </p>
                  </div>
                ) : isVideo ? (
                  <div className="mb-4">
                    <button
                      onClick={() => onGenerateTranscript(t.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                    >
                      <Sparkles className="h-3 w-3" />
                      Transcribe with Whisper AI
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Author & Footer Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={
                      t.authorAvatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        t.authorName
                      )}&backgroundColor=5d5fef`
                    }
                    alt={t.authorName}
                    className="h-8 w-8 rounded-full object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold text-white truncate flex items-center gap-1">
                      {t.authorName}
                      <CheckCircle2 className="h-3 w-3 text-indigo-400 shrink-0" />
                    </h5>
                    <p className="text-[11px] text-slate-400 truncate">
                      {t.authorTitle || t.authorEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onGenerateCaseStudy(t)}
                    title="Generate AI Case Study from this testimonial"
                    className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] font-semibold text-slate-300 transition-colors"
                  >
                    <FileText className="h-3 w-3 text-indigo-400" />
                    <span className="hidden sm:inline">Case Study</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <MessageSquare className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white">No testimonials found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search filters or share your submission link to collect reviews.
          </p>
        </div>
      )}
    </div>
  );
}
