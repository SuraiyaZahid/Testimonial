"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Heart, Code2, Sparkles, Settings, Plus, Share2 } from "lucide-react";
import SpaceHeader from "@/components/dashboard/SpaceHeader";
import StatsOverview from "@/components/dashboard/StatsOverview";
import InboxTestimonialsView from "@/components/dashboard/InboxTestimonialsView";
import EmbedWidgetBuilder from "@/components/dashboard/EmbedWidgetBuilder";
import NpsEngineView from "@/components/dashboard/NpsEngineView";
import BrandMentionsView from "@/components/dashboard/BrandMentionsView";
import AiCaseStudyView from "@/components/dashboard/AiCaseStudyView";
import SpaceSettingsView from "@/components/dashboard/SpaceSettingsView";
import CreateSpaceModal from "@/components/dashboard/CreateSpaceModal";
import AddTestimonialModal from "@/components/dashboard/AddTestimonialModal";

interface DashboardClientProps {
  initialSpace: any;
  allSpaces: any[];
  initialTab?: string;
  initialCreateSpaceOpen?: boolean;
}

export default function DashboardClient({
  initialSpace,
  allSpaces,
  initialTab = "testimonials",
  initialCreateSpaceOpen = false,
}: DashboardClientProps) {
  const router = useRouter();
  const [currentSpace, setCurrentSpace] = useState(initialSpace);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(initialCreateSpaceOpen);
  const [isAddTestimonialOpen, setIsAddTestimonialOpen] = useState(false);

  async function refreshSpaceData() {
    try {
      const res = await fetch(`/api/v1/spaces/${currentSpace.slug}`);
      const data = await res.json();
      if (data.success) {
        setCurrentSpace(data.data);
      }
    } catch (e) {
      console.error("Refresh error:", e);
    }
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/v1/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !current }),
      });
      if (res.ok) {
        refreshSpaceData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteTestimonial(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/v1/testimonials/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        refreshSpaceData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleGenerateTranscript(id: string) {
    try {
      const res = await fetch("/api/v1/ai/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId: id }),
      });
      if (res.ok) {
        refreshSpaceData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleGenerateCaseStudy(testimonial: any) {
    setActiveTab("casestudy");
  }

  const tabs = [
    { id: "testimonials", label: "Testimonials", icon: MessageSquare, count: currentSpace.testimonials.length },
    { id: "embed", label: "Wall of Love & Widgets", icon: Code2 },
    { id: "nps", label: "NPS Engine", icon: Heart, count: currentSpace.npsResponses.length },
    { id: "social", label: "Brand Mentions", icon: Share2 },
    { id: "casestudy", label: "AI Case Studies", icon: Sparkles, count: currentSpace.caseStudies.length },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Space Header */}
      <SpaceHeader
        currentSpace={currentSpace}
        allSpaces={allSpaces}
        onOpenEmbedModal={() => setActiveTab("embed")}
        onOpenCreateSpace={() => setIsCreateSpaceOpen(true)}
        onOpenAddModal={() => setIsAddTestimonialOpen(true)}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview Bar */}
        <StatsOverview
          testimonials={currentSpace.testimonials}
          npsResponses={currentSpace.npsResponses}
        />

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-800 gap-2 mb-8 pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab View Contents */}
        {activeTab === "testimonials" && (
          <InboxTestimonialsView
            testimonials={currentSpace.testimonials}
            onToggleFeatured={handleToggleFeatured}
            onDelete={handleDeleteTestimonial}
            onGenerateTranscript={handleGenerateTranscript}
            onGenerateCaseStudy={handleGenerateCaseStudy}
          />
        )}

        {activeTab === "embed" && (
          <EmbedWidgetBuilder
            spaceSlug={currentSpace.slug}
            testimonials={currentSpace.testimonials}
            primaryColor={currentSpace.primaryColor}
          />
        )}

        {activeTab === "nps" && (
          <NpsEngineView
            spaceId={currentSpace.id}
            spaceName={currentSpace.name}
            npsResponses={currentSpace.npsResponses}
            onRefresh={refreshSpaceData}
          />
        )}

        {activeTab === "social" && (
          <BrandMentionsView
            spaceId={currentSpace.id}
            testimonials={currentSpace.testimonials}
            onRefresh={refreshSpaceData}
            onToggleFeatured={handleToggleFeatured}
          />
        )}

        {activeTab === "casestudy" && (
          <AiCaseStudyView
            spaceId={currentSpace.id}
            spaceName={currentSpace.name}
            caseStudies={currentSpace.caseStudies}
            testimonials={currentSpace.testimonials}
            onRefresh={refreshSpaceData}
          />
        )}

        {activeTab === "settings" && (
          <SpaceSettingsView
            space={currentSpace}
            onRefresh={refreshSpaceData}
          />
        )}
      </main>

      {/* Modals */}
      {isCreateSpaceOpen && (
        <CreateSpaceModal
          onClose={() => setIsCreateSpaceOpen(false)}
          onSuccess={(newSlug) => {
            setIsCreateSpaceOpen(false);
            router.push(`/dashboard?space=${newSlug}`);
          }}
        />
      )}

      {isAddTestimonialOpen && (
        <AddTestimonialModal
          spaceId={currentSpace.id}
          onClose={() => setIsAddTestimonialOpen(false)}
          onSuccess={() => {
            setIsAddTestimonialOpen(false);
            refreshSpaceData();
          }}
        />
      )}
    </div>
  );
}
