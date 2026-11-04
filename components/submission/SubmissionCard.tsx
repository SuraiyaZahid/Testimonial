"use client";

import { useState } from "react";
import { Video, PenLine, Heart, Sparkles, HelpCircle } from "lucide-react";
import VideoRecorderModal from "./VideoRecorderModal";
import TextSubmissionModal from "./TextSubmissionModal";
import NpsModal from "./NpsModal";
import ThankYouView from "./ThankYouView";

interface SpaceProps {
  id: string;
  name: string;
  slug: string;
  headerTitle?: string | null;
  customMessage?: string | null;
  logoUrl?: string | null;
  questions?: string | null;
  collectionType?: string;
  collectStarRating?: boolean;
  theme?: string;
  primaryColor?: string;
  thankYouTitle?: string | null;
  thankYouMessage?: string | null;
  redirectUrl?: string | null;
  maxVideoDuration?: number;
}

export default function SubmissionCard({ space }: { space: SpaceProps }) {
  const [activeModal, setActiveModal] = useState<"video" | "text" | "nps" | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Parse questions
  let parsedQuestions: string[] = [
    "Who are you and what company do you represent?",
    "What problem did our product solve for you?",
    "What is your favorite feature and why?",
  ];
  if (space.questions) {
    try {
      parsedQuestions = JSON.parse(space.questions);
    } catch {
      parsedQuestions = [space.questions];
    }
  }

  const allowVideo = space.collectionType !== "TEXT";
  const allowText = space.collectionType !== "VIDEO";

  if (isCompleted) {
    return (
      <ThankYouView
        title={space.thankYouTitle || undefined}
        message={space.thankYouMessage || undefined}
        redirectUrl={space.redirectUrl || undefined}
        onReset={() => setIsCompleted(false)}
      />
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-xl rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
      {/* Space Logo */}
      {space.logoUrl && (
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-950 shadow-xl">
          <img
            src={space.logoUrl}
            alt={space.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Header & Description */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
          {space.headerTitle || `Would you like to give a shoutout for ${space.name}?`}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
          {space.customMessage || "We would love to hear your honest feedback. You can record a quick video or drop a few lines!"}
        </p>
      </div>

      {/* Question Prompts Card */}
      {parsedQuestions.length > 0 && (
        <div className="mb-8 rounded-2xl bg-slate-950/70 border border-slate-800/80 p-5 shadow-inner">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
            <HelpCircle className="h-4 w-4" />
            <span>Questions to answer</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {parsedQuestions.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-400">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submission CTA Buttons */}
      <div className="space-y-3">
        {allowVideo && (
          <button
            onClick={() => setActiveModal("video")}
            className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3.5 px-6 text-sm sm:text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ backgroundColor: space.primaryColor || "#5D5FEF" }}
          >
            <Video className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Record a video (up to {Math.floor((space.maxVideoDuration || 180) / 60)} mins)</span>
          </button>
        )}

        {allowText && (
          <button
            onClick={() => setActiveModal("text")}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 py-3.5 px-6 text-sm sm:text-base font-semibold text-slate-100 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <PenLine className="h-5 w-5 text-indigo-400" />
            <span>Send in text review</span>
          </button>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={() => setActiveModal("nps")}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span>Just want to rate your experience? (NPS Survey)</span>
          </button>
        </div>
      </div>

      {/* Powered by badge */}
      <div className="mt-8 pt-4 border-t border-slate-800/60 text-center">
        <span className="text-[11px] text-slate-500 font-medium">
          Powered by <strong className="text-slate-400">Testimonial Engine</strong>
        </span>
      </div>

      {/* Modals */}
      {activeModal === "video" && (
        <VideoRecorderModal
          spaceId={space.id}
          spaceName={space.name}
          primaryColor={space.primaryColor || undefined}
          maxDuration={space.maxVideoDuration || 180}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            setIsCompleted(true);
          }}
        />
      )}

      {activeModal === "text" && (
        <TextSubmissionModal
          spaceId={space.id}
          spaceName={space.name}
          primaryColor={space.primaryColor || undefined}
          questions={parsedQuestions}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            setIsCompleted(true);
          }}
        />
      )}

      {activeModal === "nps" && (
        <NpsModal
          spaceId={space.id}
          spaceName={space.name}
          onClose={() => setActiveModal(null)}
          onPromoteToVideo={() => setActiveModal("video")}
        />
      )}
    </div>
  );
}

