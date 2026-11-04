"use client";

import { useState } from "react";
import { Heart, Smile, Meh, Frown, Plus, CheckCircle2, Video, ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import NpsModal from "@/components/submission/NpsModal";

interface NpsEngineViewProps {
  spaceId: string;
  spaceName: string;
  npsResponses: any[];
  onRefresh: () => void;
}

export default function NpsEngineView({
  spaceId,
  spaceName,
  npsResponses,
  onRefresh,
}: NpsEngineViewProps) {
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  const total = npsResponses.length;
  const promoters = npsResponses.filter((n) => n.score >= 9).length;
  const passives = npsResponses.filter((n) => n.score >= 7 && n.score <= 8).length;
  const detractors = npsResponses.filter((n) => n.score <= 6).length;

  const promoterPct = total > 0 ? Math.round((promoters / total) * 100) : 0;
  const passivePct = total > 0 ? Math.round((passives / total) * 100) : 0;
  const detractorPct = total > 0 ? Math.round((detractors / total) * 100) : 0;

  const npsScore = promoterPct - detractorPct;

  return (
    <div className="space-y-8">
      {/* Top Banner & Overview */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-400">
            <Heart className="h-3.5 w-3.5" />
            <span>PRD 4.2 Automated NPS Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Net Promoter Score Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Continuously gauge customer loyalty. Promoters who score 9 or 10 are automatically invited to record an asynchronous video testimonial.
          </p>
        </div>

        <div className="flex items-center gap-6 self-start lg:self-auto">
          {/* NPS Big Index Pill */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 text-center min-w-[140px]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              NPS Index
            </span>
            <div className={`text-3xl font-extrabold ${npsScore >= 50 ? "text-emerald-400" : npsScore >= 0 ? "text-indigo-400" : "text-rose-400"}`}>
              {npsScore > 0 ? `+${npsScore}` : `${npsScore}`}
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">
              Scale: -100 to +100
            </span>
          </div>

          <button
            onClick={() => setShowSimulateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Smile className="h-4 w-4" />
            <span>Simulate Survey</span>
          </button>
        </div>
      </div>

      {/* Breakdown Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Promoters */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Smile className="h-4 w-4" /> Promoters (9-10)
            </span>
            <span className="text-sm font-bold text-white">{promoterPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-2">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${promoterPct}%` }} />
          </div>
          <span className="text-[11px] text-slate-400">
            {promoters} respondents • Promoted to Video Shoutout
          </span>
        </div>

        {/* Passives */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <Meh className="h-4 w-4" /> Passives (7-8)
            </span>
            <span className="text-sm font-bold text-white">{passivePct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-2">
            <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${passivePct}%` }} />
          </div>
          <span className="text-[11px] text-slate-400">
            {passives} respondents • Satisfied but neutral
          </span>
        </div>

        {/* Detractors */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <Frown className="h-4 w-4" /> Detractors (0-6)
            </span>
            <span className="text-sm font-bold text-white">{detractorPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-2">
            <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${detractorPct}%` }} />
          </div>
          <span className="text-[11px] text-slate-400">
            {detractors} respondents • Requires product attention
          </span>
        </div>
      </div>

      {/* Responses Log */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">NPS Feedback Submissions</h3>
          <span className="text-xs text-slate-400">{npsResponses.length} total entries</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {npsResponses.map((n) => {
            const isPromoter = n.score >= 9;
            const isPassive = n.score >= 7 && n.score <= 8;

            return (
              <div key={n.id} className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center justify-center h-7 w-7 rounded-lg text-xs font-bold ${
                        isPromoter
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : isPassive
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {n.score}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {n.authorName || "Anonymous Customer"}
                    </span>
                    {n.authorEmail && (
                      <span className="text-xs text-slate-500">
                        ({n.authorEmail})
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500">
                      • {formatDate(n.createdAt)}
                    </span>
                  </div>

                  {n.feedback ? (
                    <p className="text-xs text-slate-300 leading-relaxed pl-9">
                      "{n.feedback}"
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 italic pl-9">
                      No additional comments left.
                    </p>
                  )}
                </div>

                {isPromoter && (
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-400">
                    <Video className="h-3 w-3" />
                    Video Prompted
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showSimulateModal && (
        <NpsModal
          spaceId={spaceId}
          spaceName={spaceName}
          onClose={() => {
            setShowSimulateModal(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

