import Link from "next/link";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import WallOfLoveCard from "@/components/widgets/WallOfLoveCard";
import {
  Video,
  PenLine,
  Heart,
  Sparkles,
  Code2,
  CheckCircle2,
  Star,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
} from "lucide-react";

export default async function HomePage() {
  const supaflowSpace = await prisma.space.findUnique({
    where: { slug: "supaflow" },
    include: {
      testimonials: {
        where: { isFeatured: true },
        take: 6,
      },
    },
  });

  const sampleTestimonials = supaflowSpace?.testimonials || [];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-300 mb-8 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>Customer Social Proof & Feedback Engine</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400">Inspired by Testimonial.to</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Collect customer testimonials{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              without friction.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            In minutes, collect high-converting video and text testimonials, measure customer sentiment with NPS, and embed a gorgeous Wall of Love on your website.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Explore Dashboard</span>
            </Link>

            <Link
              href="/submit/supaflow"
              target="_blank"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-8 py-4 text-sm font-bold text-slate-200 transition-all hover:scale-105"
            >
              <Video className="h-4 w-4 text-indigo-400" />
              <span>Test Video Submission Page</span>
            </Link>
          </div>

          {/* Social Proof Numbers */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">15% - 30%</div>
              <div className="text-xs text-slate-400 mt-1">Average conversion rate lift (PRD 2)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">&lt; 100ms</div>
              <div className="text-xs text-slate-400 mt-1">Widget embed loading speed (SRS 5.1)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">Whisper AI</div>
              <div className="text-xs text-slate-400 mt-1">Automated speech-to-text transcripts</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">+74 NPS</div>
              <div className="text-xs text-slate-400 mt-1">Built-in Net Promoter Score engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars (PRD Modules 4.1 - 4.4) */}
      <section className="py-20 bg-slate-950/60 border-y border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
              All-In-One Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything you need to turn happy clients into your best salespeople
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 4.1 Capture Module */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Video className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">1. Capture Module</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Branded collection spaces supporting browser webcam recording, microphone visualizers, file uploads, and star ratings with custom prompts.
              </p>
            </div>

            {/* 4.2 Measure & Analytics */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Heart className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">2. NPS & Social Mentions</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated Net Promoter Score tracking with follow-up triggers for Promoters, plus one-click importing of Twitter, LinkedIn, and Reddit praise.
              </p>
            </div>

            {/* 4.3 Showcase & Widgets */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Code2 className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">3. Wall of Love & Embeds</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-performance masonry grids, infinite scrolling marquees, carousels, and badges with one-line async script integration.
              </p>
            </div>

            {/* 4.4 AI & Automation */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white">4. AI Intelligence</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated Whisper AI video-to-text transcriptions and one-click AI Case Study generator synthesizing quotes into challenges, solutions, and metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Wall of Love Showcase */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Live Embed Preview
              </span>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                The Wall of Love in Action
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Here is what your website visitors see when you embed your SupaFlow space.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/embed/supaflow/carousel"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <span>View Scrolling Marquee</span>
                <ArrowRight className="h-3 w-3" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/30"
              >
                <span>Customize in Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Masonry Showcase */}
          <div className="masonry-columns-1 sm:masonry-columns-2 lg:masonry-columns-3">
            {sampleTestimonials.map((t) => (
              <WallOfLoveCard
                key={t.id}
                testimonial={t as any}
                theme="dark"
                primaryColor="#5D5FEF"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Testimonial Engine. Built strictly to PRD & SRS specification.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-300">Dashboard</Link>
            <Link href="/submit/supaflow" target="_blank" className="hover:text-slate-300">Submit Review</Link>
            <Link href="/embed/supaflow/wall" target="_blank" className="hover:text-slate-300">Wall of Love</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

