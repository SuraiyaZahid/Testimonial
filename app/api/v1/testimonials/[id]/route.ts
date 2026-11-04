import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      include: { space: true },
    });

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error: any) {
    console.error("GET /api/v1/testimonials/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : existing.isFeatured,
        isApproved: body.isApproved !== undefined ? body.isApproved : existing.isApproved,
        rating: body.rating !== undefined ? Number(body.rating) : existing.rating,
        content: body.content ?? existing.content,
        transcript: body.transcript ?? existing.transcript,
        authorName: body.authorName ?? existing.authorName,
        authorTitle: body.authorTitle ?? existing.authorTitle,
        tags: body.tags ?? existing.tags,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PATCH /api/v1/testimonials/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error: any) {
    console.error("DELETE /api/v1/testimonials/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}

