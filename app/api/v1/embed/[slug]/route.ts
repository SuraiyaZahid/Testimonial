import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get("featured") === "true";
    const typeFilter = searchParams.get("type"); // "VIDEO" or "TEXT"

    const space = await prisma.space.findUnique({
      where: { slug },
      include: {
        testimonials: {
          where: {
            isApproved: true,
            ...(featuredOnly ? { isFeatured: true } : {}),
            ...(typeFilter ? { type: typeFilter } : {}),
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!space) {
      return NextResponse.json(
        { success: false, error: "Space not found" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        space: {
          id: space.id,
          name: space.name,
          slug: space.slug,
          theme: space.theme,
          primaryColor: space.primaryColor,
        },
        testimonials: space.testimonials,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/v1/embed/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load embed data" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
