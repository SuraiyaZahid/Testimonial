"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";

interface ThankYouViewProps {
  title?: string;
  message?: string;
  redirectUrl?: string;
  onReset?: () => void;
}

export default function ThankYouView({
  title = "Thank you so much! 🎉",
  message = "Your testimonial means the world to our team. We've received your submission and will review it shortly.",
  redirectUrl,
  onReset,
}: ThankYouViewProps) {
  useEffect(() => {
    // Launch fireworks confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#5D5FEF", "#3B82F6", "#10B981", "#F59E0B"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#5D5FEF", "#EC4899", "#8B5CF6", "#F59E0B"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-lg rounded-3xl bg-slate-900/90 border border-slate-800 p-8 text-center shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 mb-6 shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
        {title}
      </h2>

      <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-8">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {redirectUrl && (
          <a
            href={redirectUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <span>Continue to website</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        )}

        {onReset && (
          <button
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-3 text-xs font-semibold text-slate-300 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Submit another testimonial
          </button>
        )}
      </div>
    </div>
  );
}
