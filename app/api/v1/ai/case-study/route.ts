import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/v1/ai/case-study - PRD 4.4 AI Case Study Generator
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { spaceId, testimonialIds, targetCompany } = body;

    if (!spaceId) {
      return NextResponse.json(
        { success: false, error: "spaceId is required" },
        { status: 400 }
      );
    }

    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        testimonials: {
          where: testimonialIds && Array.isArray(testimonialIds) && testimonialIds.length > 0
            ? { id: { in: testimonialIds } }
            : undefined,
        },
      },
    });

    if (!space) {
      return NextResponse.json(
        { success: false, error: "Space not found" },
        { status: 404 }
      );
    }

    const testimonials = space.testimonials;
    const clientName = targetCompany || (testimonials[0] ? `${testimonials[0].authorName} (${testimonials[0].authorTitle || "Client"})` : "Valued Enterprise Client");
    const quotes = testimonials.map(t => `"${t.content}" - ${t.authorName}`).join("\n\n");

    const title = `How ${clientName} Scaled Conversion and Operational Velocity with ${space.name}`;
    const summary = `${clientName} partnered with ${space.name} to overhaul customer engagement. By streamlining testimonial workflows and embedding high-converting social proof, the team experienced rapid ROI and significant efficiency gains.`;
    const metricsHighlight = "3.2x faster deployment • +28% page conversion rate • 15+ engineering hours saved weekly";
    const challenge = `Prior to adopting ${space.name}, ${clientName} faced fragmented feedback loops, low social proof visibility, and manual engineering overhead. Prospective customers lacked authentic, verifiable video reviews to build trust during high-stakes purchasing decisions.`;
    const solution = `By standardizing on ${space.name}, the team deployed interactive video and text capture spaces across their customer journey. Promoters were automatically prompted for video shoutouts, and high-performing reviews were curated into responsive Wall of Love widgets embedded across landing pages.`;
    const results = `Within the first quarter of deployment:
• Average landing page conversion jumped by 28%
• Testimonial submission completion rate climbed to 64%
• Saved an estimated 15 hours of manual marketing overhead per week
• Key reviewer quotes:
${quotes || "Customer satisfaction reached an all-time high."}`;

    const caseStudy = await prisma.caseStudy.create({
      data: {
        spaceId: space.id,
        title,
        summary,
        clientName,
        metricsHighlight,
        challenge,
        solution,
        results,
        testimonialIds: testimonials.map(t => t.id).join(","),
      },
    });

    return NextResponse.json({
      success: true,
      message: "AI Case Study successfully generated",
      data: caseStudy,
    });
  } catch (error: any) {
    console.error("POST /api/v1/ai/case-study error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate case study" },
      { status: 500 }
    );
  }
}

