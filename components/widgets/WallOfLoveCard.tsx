"use client";

import { useState } from "react";
import { Star, Play, Pause, FileText, CheckCircle2, ExternalLink } from "lucide-react";
import { TwitterIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { formatDate } from "@/lib/utils";

export interface TestimonialItem {
  id: string;
  type: string;
  rating: number;
  content: string;
  videoUrl?: string | null;
  videoDuration?: number | null;
  transcript?: string | null;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string | null;
  authorTitle?: string | null;
  authorSocial?: string | null;
  source?: string;
  sourceUrl?: string | null;
  isFeatured?: boolean;
  createdAt: string | Date;
}

interface WallOfLoveCardProps {
  testimonial: TestimonialItem;
  theme?: "dark" | "light";
  primaryColor?: string;
  showRating?: boolean;
  onSelect?: () => void;
}

export default function WallOfLoveCard({
  testimonial,
  theme = "dark",
  primaryColor = "#5D5FEF",
  showRating = true,
  onSelect,
}: WallOfLoveCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const isDark = theme === "dark";
  const isVideo = testimonial.type === "VIDEO" && testimonial.videoUrl;

  return (
    <div
      onClick={onSelect}
      className={`relative break-inside-avoid rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isDark
          ? "bg-slate-900/90 border border-slate-800 text-slate-100 hover:border-slate-700 shadow-md shadow-black/40"
          : "bg-white border border-slate-200 text-slate-800 hover:border-slate-300 shadow-md shadow-slate-200/50"
      }`}
    >
      {/* Video Player (if video review) */}
      {isVideo && (
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-black shadow-inner">
          <video
            src={testimonial.videoUrl!}
            controls={isPlaying}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-cover"
          />
          {!isPlaying && (
            <div
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer group hover:bg-black/25 transition-all"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: primaryColor }}
              >
                <Play className="h-6 w-6 fill-white ml-1" />
              </div>
              {testimonial.videoDuration && (
                <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {Math.floor(testimonial.videoDuration / 60)}:{(testimonial.videoDuration % 60).toString().padStart(2, "0")}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Star Rating & Source Icon */}
      <div className="flex items-center justify-between mb-3">
        {showRating && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= testimonial.rating
                    ? "fill-amber-400 text-amber-400"
                    : isDark
                    ? "text-slate-700"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* Source Icon (Twitter, LinkedIn, Form) */}
        {testimonial.source === "TWITTER" && (
          <a
            href={testimonial.sourceUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300"
          >
            <TwitterIcon className="h-4 w-4" />
          </a>
        )}
        {testimonial.source === "LINKEDIN" && (
          <a
            href={testimonial.sourceUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Review Text Content */}
      <p
        className={`text-sm leading-relaxed mb-4 font-normal ${
          isDark ? "text-slate-200" : "text-slate-700"
        }`}
      >
        "{testimonial.content}"
      </p>

      {/* AI Speech-to-Text Transcript Drawer */}
      {testimonial.transcript && (
        <div className="mb-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTranscript(!showTranscript);
            }}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
              isDark
                ? "bg-slate-800/80 text-indigo-300 hover:bg-slate-800"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            <FileText className="h-3 w-3" />
            <span>{showTranscript ? "Hide Transcript" : "AI Video Transcript"}</span>
          </button>

          {showTranscript && (
            <div
              className={`mt-2 rounded-xl p-3 text-xs leading-relaxed border ${
                isDark
                  ? "bg-slate-950/80 border-slate-800 text-slate-300"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              {testimonial.transcript}
            </div>
          )}
        </div>
      )}

      {/* Author Footer */}
      <div className="flex items-center gap-3 pt-3 border-t border-slate-800/50">
        <img
          src={
            testimonial.authorAvatar ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              testimonial.authorName
            )}&backgroundColor=5d5fef`
          }
          alt={testimonial.authorName}
          className="h-10 w-10 rounded-full object-cover border border-slate-700"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4
              className={`text-sm font-semibold truncate ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {testimonial.authorName}
            </h4>
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          </div>
          {testimonial.authorTitle && (
            <p
              className={`text-xs truncate ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {testimonial.authorTitle}
            </p>
          )}
          {testimonial.authorSocial && !testimonial.authorTitle && (
            <p className="text-xs text-indigo-400 truncate">
              {testimonial.authorSocial}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
