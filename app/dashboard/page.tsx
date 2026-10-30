import { Suspense } from "react";
import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ space?: string; tab?: string; createSpace?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { space: requestedSlug, tab = "testimonials", createSpace } = await searchParams;

  // Fetch all spaces
  const allSpaces = await prisma.space.findMany({
    include: {
      _count: {
        select: {
          testimonials: true,
          npsResponses: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (allSpaces.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">No spaces found</h2>
          <p className="text-slate-400 text-sm">Please run `npm run prisma:seed` to seed sample data.</p>
        </div>
      </div>
    );
  }

  // Find active space
  const activeSpace = allSpaces.find((s) => s.slug === requestedSlug) || allSpaces[0];

  // Fetch full details of active space
  const fullSpace = await prisma.space.findUnique({
    where: { id: activeSpace.id },
    include: {
      testimonials: {
        orderBy: { createdAt: "desc" },
      },
      npsResponses: {
        orderBy: { createdAt: "desc" },
      },
      caseStudies: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading Dashboard...</div>}>
      <DashboardClient
        initialSpace={fullSpace!}
        allSpaces={allSpaces}
        initialTab={tab}
        initialCreateSpaceOpen={createSpace === "true"}
      />
    </Suspense>
  );
}
