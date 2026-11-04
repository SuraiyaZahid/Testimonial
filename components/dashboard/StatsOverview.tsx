"use client";

import { MessageSquare, Video, PenLine, Star, Heart, TrendingUp } from "lucide-react";

interface StatsOverviewProps {
  testimonials: any[];
  npsResponses: any[];
}

export default function StatsOverview({ testimonials, npsResponses }: StatsOverviewProps) {
  const total = testimonials.length;
  const videos = testimonials.filter((t) => t.type === "VIDEO").length;
  const texts = testimonials.filter((t) => t.type === "TEXT").length;
  
  // Calculate average rating
  const avgRating = total > 0
    ? (testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / total).toFixed(1)
    : "5.0";

  // Calculate NPS Score (Promoters % - Detractors %)
  let npsScore = 0;
  if (npsResponses.length > 0) {
    const promoters = npsResponses.filter((n) => n.score >= 9).length;
    const detractors = npsResponses.filter((n) => n.score <= 6).length;
    npsScore = Math.round(((promoters - detractors) / npsResponses.length) * 100);
  }

  const statCards = [
    {
      title: "Total Testimonials",
      value: total,
      subtext: `${testimonials.filter(t => t.isFeatured).length} featured on Wall`,
      icon: MessageSquare,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Video Shoutouts",
      value: videos,
      subtext: `${total > 0 ? Math.round((videos / total) * 100) : 0}% of all responses`,
      icon: Video,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Text Reviews",
      value: texts,
      subtext: "High-converting written quotes",
      icon: PenLine,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Average Rating",
      value: `${avgRating} ★`,
      subtext: "Based on all verified submissions",
      icon: Star,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Net Promoter Score",
      value: npsScore > 0 ? `+${npsScore}` : `${npsScore}`,
      subtext: `${npsResponses.length} customer survey responses`,
      icon: Heart,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 shadow-sm transition-all hover:border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{stat.title}</span>
              <div className={`p-2 rounded-xl border ${stat.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {stat.value}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">
              {stat.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}

