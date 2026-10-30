"use client";

import { useState } from "react";
import { Sparkles, FileText, Plus, Copy, Check, ExternalLink, Loader2, X, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AiCaseStudyViewProps {
  spaceId: string;
  spaceName: string;
  caseStudies: any[];
  testimonials: any[];
  onRefresh: () => void;
}

export default function AiCaseStudyView({
  spaceId,
  spaceName,
  caseStudies,
  testimonials,
  onRefresh,
}: AiCaseStudyViewProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [targetCompany, setTargetCompany] = useState("");
  const [selectedTestimonials, setSelectedTestimonials] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch("/api/v1/ai/case-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId,
          targetCompany,
          testimonialIds: selectedTestimonials,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Generation failed");
      }

      setShowGenerateModal(false);
      setTargetCompany("");
      setSelectedTestimonials([]);
      onRefresh();
    } catch (err: any) {
      alert("Error generating case study: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCopyMarkdown(study: any) {
    const md = `# Case Study: ${study.title}
**Client:** ${study.clientName}
**Metrics:** ${study.metricsHighlight}

## Executive Summary
${study.summary}

## The Challenge
${study.challenge}

## The Solution
${study.solution}

## Key Results
${study.results}
`;
    navigator.clipboard.writeText(md);
    setCopiedId(study.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>PRD 4.4 Automated AI Case Study Generator</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Turn Testimonials into B2B Case Studies</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Automatically transform scattered video quotes and reviews into publication-ready case studies highlighting problem, solution, and measurable business ROI.
          </p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Draft New Case Study</span>
        </button>
      </div>

      {/* Case Studies List */}
      <div className="space-y-4">
        {caseStudies.map((cs) => (
          <div
            key={cs.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-sm transition-all hover:border-slate-700 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Customer Success Story
                </span>
                <h3 className="text-xl font-bold text-white">{cs.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Client: <strong className="text-slate-300">{cs.clientName}</strong> • {formatDate(cs.createdAt)}
                </p>
              </div>

              <button
                onClick={() => handleCopyMarkdown(cs)}
                className="self-start sm:self-auto flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors"
              >
                {copiedId === cs.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied Markdown!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>

            {/* Metrics Callout */}
            {cs.metricsHighlight && (
              <div className="rounded-2xl bg-indigo-950/30 border border-indigo-500/20 p-4 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                    Proven Impact & Results
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    {cs.metricsHighlight}
                  </p>
                </div>
              </div>
            )}

            {/* Executive Summary */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Executive Summary
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {cs.summary}
              </p>
            </div>

            {/* Challenge & Solution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4">
                <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                  The Challenge
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {cs.challenge}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4">
                <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  The Solution
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {cs.solution}
                </p>
              </div>
            </div>

            {/* Quantified Results */}
            <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4">
              <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                Business Outcomes & Customer Quotes
              </h5>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {cs.results}
              </div>
            </div>
          </div>
        ))}
      </div>

      {caseStudies.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white">No AI Case Studies generated yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Click "Draft New Case Study" to synthesize your customer testimonials into an in-depth story.
          </p>
        </div>
      )}

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <h3 className="text-base font-semibold text-white">Draft AI Case Study</h3>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Company / Client Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ScaleLogic or DevFlow"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Select Testimonials to synthesize:
                </label>
                <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl bg-slate-950 border border-slate-800 p-2">
                  {testimonials.map((t) => (
                    <label
                      key={t.id}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-900 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTestimonials.includes(t.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTestimonials([...selectedTestimonials, t.id]);
                          } else {
                            setSelectedTestimonials(selectedTestimonials.filter((id) => id !== t.id));
                          }
                        }}
                        className="mt-0.5 h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-indigo-600"
                      />
                      <div className="min-w-0 flex-1 text-xs">
                        <span className="font-semibold text-white truncate block">
                          {t.authorName} ({t.authorTitle || t.type})
                        </span>
                        <span className="text-slate-400 text-[11px] truncate block">
                          "{t.content}"
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI is drafting your case study...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Full Case Study</span>
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
