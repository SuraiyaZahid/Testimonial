"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink, Code2, Plus, Sparkles, ChevronDown } from "lucide-react";

interface SpaceHeaderProps {
  currentSpace: any;
  allSpaces: any[];
  onOpenEmbedModal: () => void;
  onOpenCreateSpace: () => void;
  onOpenAddModal: () => void;
}

export default function SpaceHeader({
  currentSpace,
  allSpaces,
  onOpenEmbedModal,
  onOpenCreateSpace,
  onOpenAddModal,
}: SpaceHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/submit/${currentSpace.slug}`
    : `/submit/${currentSpace.slug}`;

  function handleCopy() {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Space Dropdown & Details */}
        <div className="flex items-center gap-4">
          {currentSpace.logoUrl ? (
            <img
              src={currentSpace.logoUrl}
              alt={currentSpace.name}
              className="h-12 w-12 rounded-xl object-cover border border-slate-800 shadow-md"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-lg">
              {currentSpace.name.charAt(0)}
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 group text-left"
            >
              <div>
                <h1 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                  <span>{currentSpace.name}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </h1>
                <p className="text-xs text-slate-400">
                  Slug: <span className="font-mono text-slate-300">/{currentSpace.slug}</span>
                </p>
              </div>
            </button>

            {/* Switch Space Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fade-in">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                  Switch Space
                </div>
                {allSpaces.map((s) => (
                  <Link
                    key={s.id}
                    href={`/dashboard?space=${s.slug}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                      s.id === currentSpace.id
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span className="truncate">{s.name}</span>
                    <span className="text-[10px] opacity-70">
                      {s._count?.testimonials ?? 0} reviews
                    </span>
                  </Link>
                ))}
                <div className="border-t border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenCreateSpace();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-400 hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Create New Space
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Public Link & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Public Link Box */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 max-w-xs sm:max-w-none">
            <span className="truncate max-w-[170px] sm:max-w-[220px] text-slate-400 font-mono">
              /submit/{currentSpace.slug}
            </span>
            <button
              onClick={handleCopy}
              className="ml-2 p-1 text-slate-400 hover:text-white transition-colors"
              title="Copy link"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            <Link
              href={`/submit/${currentSpace.slug}`}
              target="_blank"
              className="ml-1 p-1 text-slate-400 hover:text-indigo-400 transition-colors"
              title="Open public page"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Embed Widget Button */}
          <button
            onClick={onOpenEmbedModal}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all"
          >
            <Code2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Embed Widget</span>
          </button>

          {/* Add Testimonial / Import Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>
    </div>
  );
}
