import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import SubmissionCard from "@/components/submission/SubmissionCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SubmitPage({ params }: Props) {
  const { slug } = await params;

  const space = await prisma.space.findUnique({
    where: { slug },
  });

  if (!space) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <SubmissionCard space={space} />
    </main>
  );
}

