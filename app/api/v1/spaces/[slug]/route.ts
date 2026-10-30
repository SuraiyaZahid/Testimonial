import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/v1/spaces/[slug] (SRS 4.1.1)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const space = await prisma.space.findUnique({
      where: { slug },
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

    if (!space) {
      return NextResponse.json(
        { success: false, error: "Space not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: space });
  } catch (error: any) {
    console.error("GET /api/v1/spaces/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/spaces/[slug] - Update space settings
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const space = await prisma.space.findUnique({ where: { slug } });
    if (!space) {
      return NextResponse.json(
        { success: false, error: "Space not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.space.update({
      where: { slug },
      data: {
        name: body.name ?? space.name,
        headerTitle: body.headerTitle ?? space.headerTitle,
        customMessage: body.customMessage ?? space.customMessage,
        logoUrl: body.logoUrl ?? space.logoUrl,
        questions: body.questions
          ? typeof body.questions === "string"
            ? body.questions
            : JSON.stringify(body.questions)
          : space.questions,
        collectionType: body.collectionType ?? space.collectionType,
        collectStarRating: body.collectStarRating ?? space.collectStarRating,
        theme: body.theme ?? space.theme,
        primaryColor: body.primaryColor ?? space.primaryColor,
        thankYouTitle: body.thankYouTitle ?? space.thankYouTitle,
        thankYouMessage: body.thankYouMessage ?? space.thankYouMessage,
        redirectUrl: body.redirectUrl ?? space.redirectUrl,
        maxVideoDuration: body.maxVideoDuration ?? space.maxVideoDuration,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PATCH /api/v1/spaces/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update space" },
      { status: 500 }
    );
  }
}
