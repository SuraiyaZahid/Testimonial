"use client";

import { useState } from "react";
import { Code2, Copy, Check, Eye, ExternalLink, Sparkles, LayoutGrid, Sliders, MessageSquare, Flame } from "lucide-react";
import WallOfLoveCard from "@/components/widgets/WallOfLoveCard";

interface EmbedWidgetBuilderProps {
  spaceSlug: string;
  testimonials: any[];
  primaryColor?: string;
}

export default function EmbedWidgetBuilder({
  spaceSlug,
  testimonials,
  primaryColor = "#5D5FEF",
}: EmbedWidgetBuilderProps) {
  const [widgetType, setWidgetType] = useState<"wall" | "carousel" | "badge" | "toast">("wall");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showRating, setShowRating] = useState(true);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  // Code snippets
  const scriptSnippet = `<script type="text/javascript" src="${baseUrl}/embed.js" data-space="${spaceSlug}" data-type="${widgetType}" data-theme="${theme}" async></script>`;
  
  const iframeSnippet = `<iframe src="${baseUrl}/embed/${spaceSlug}/${widgetType}?theme=${theme}" width="100%" height="${widgetType === 'badge' ? '80' : '650'}" frameborder="0" scrolling="no"></iframe>`;

  const reactSnippet = `// Install or use iframe / script embed in your React / Next.js app:
<iframe
  src="${baseUrl}/embed/${spaceSlug}/${widgetType}?theme=${theme}"
  width="100%"
  height="${widgetType === 'badge' ? '80' : '650'}"
  style={{ border: 'none', overflow: 'hidden' }}
/>`;

  function handleCopy(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  }

  const sampleItems = testimonials.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Widget Type Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {[
          { id: "wall", label: "Wall of Love (Masonry)", desc: "Interactive multi-column grid" },
          { id: "carousel", label: "Scrolling Marquee", desc: "Infinite horizontal movement" },
          { id: "badge", label: "Social Proof Badge", desc: "Compact pill with avatars & rating" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setWidgetType(t.id as any)}
            className={`flex flex-col text-left rounded-2xl p-3 sm:px-4 sm:py-3 transition-all ${
              widgetType === t.id
                ? "bg-indigo-600/15 border-2 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <span className="text-xs sm:text-sm font-semibold">{t.label}</span>
            <span className="text-[11px] text-slate-400">{t.desc}</span>
          </button>
        ))}
      </div>

      {/* Widget Settings & Code Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customization Controls */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sliders className="h-4 w-4 text-indigo-400" />
            <span>Customize Widget</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`rounded-xl py-2 text-xs font-semibold border transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-indigo-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                🌙 Dark Mode
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`rounded-xl py-2 text-xs font-semibold border transition-all ${
                  theme === "light"
                    ? "bg-slate-800 border-indigo-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                ☀️ Light Mode
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showRating}
                onChange={(e) => setShowRating(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600"
              />
              <span className="text-xs text-slate-300">Show star ratings on cards</span>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <a
              href={`/embed/${spaceSlug}/${widgetType}?theme=${theme}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300"
            >
              <span>Open live embed preview in new tab</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Right Columns: Embed Code Snippets */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Code2 className="h-4 w-4 text-indigo-400" />
              <span>Copy Embed Code (SRS Section 5.1)</span>
            </div>
          </div>

          {/* Option 1: One-Line Script Tag */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>One-Line Script Tag (Fast Async CDN Loader)</span>
              <button
                onClick={() => handleCopy(scriptSnippet, "script")}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
              >
                {copiedType === "script" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy script
                  </>
                )}
              </button>
            </div>
            <pre className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-indigo-300 font-mono overflow-x-auto whitespace-pre-wrap">
              {scriptSnippet}
            </pre>
          </div>

          {/* Option 2: Iframe */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>HTML Iframe</span>
              <button
                onClick={() => handleCopy(iframeSnippet, "iframe")}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
              >
                {copiedType === "iframe" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy iframe
                  </>
                )}
              </button>
            </div>
            <pre className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-indigo-300 font-mono overflow-x-auto whitespace-pre-wrap">
              {iframeSnippet}
            </pre>
          </div>
        </div>
      </div>

      {/* Live Widget Preview Box */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Widget Interactive Preview ({widgetType.toUpperCase()})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Rendered in {theme} mode
          </span>
        </div>

        {/* Live Preview Content */}
        <div
          className={`rounded-2xl p-6 transition-colors overflow-hidden ${
            theme === "dark" ? "bg-[#0B0F19]" : "bg-slate-100"
          }`}
        >
          {widgetType === "wall" && (
            <div className="masonry-columns-1 sm:masonry-columns-2 lg:masonry-columns-3">
              {sampleItems.map((t) => (
                <WallOfLoveCard
                  key={t.id}
                  testimonial={t}
                  theme={theme}
                  showRating={showRating}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          )}

          {widgetType === "carousel" && (
            <div className="relative flex w-full overflow-hidden">
              <div className="flex animate-marquee-left gap-6 pause-marquee whitespace-nowrap pl-6">
                {[...sampleItems, ...sampleItems].map((t, idx) => (
                  <div
                    key={`${t.id}-${idx}`}
                    className="inline-block w-[320px] sm:w-[360px] shrink-0 whitespace-normal"
                  >
                    <WallOfLoveCard
                      testimonial={t}
                      theme={theme}
                      showRating={showRating}
                      primaryColor={primaryColor}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {widgetType === "badge" && (
            <div className="flex items-center justify-center py-6">
              <div
                className={`inline-flex items-center gap-3.5 rounded-full py-2 px-5 shadow-xl border ${
                  theme === "dark"
                    ? "bg-slate-900 border-slate-800 text-white"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex -space-x-2">
                  {sampleItems.slice(0, 4).map((t) => (
                    <img
                      key={t.id}
                      src={
                        t.authorAvatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          t.authorName
                        )}&backgroundColor=5d5fef`
                      }
                      alt={t.authorName}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-amber-400 text-xs">★</span>
                    ))}
                    <span className="text-xs font-bold ml-1">4.9/5</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Loved by 500+ happy customers
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

