import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/v1/spaces - list spaces
export async function GET() {
  try {
    const spaces = await prisma.space.findMany({
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
    return NextResponse.json({ success: true, data: spaces });
  } catch (error: any) {
    console.error("GET /api/v1/spaces error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch spaces" },
      { status: 500 }
    );
  }
}

// POST /api/v1/spaces - Create space (SRS 4.1.1)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, workspaceId, headerTitle, customMessage, questions, collectionType, theme, primaryColor } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Space name is required" },
        { status: 400 }
      );
    }

    // Auto-generate unique slug
    let baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    
    if (!baseSlug) baseSlug = "space-" + Date.now();

    // Check slug collision
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.space.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Default to first workspace if not provided
    let wsId = workspaceId;
    if (!wsId) {
      let ws = await prisma.workspace.findFirst();
      if (!ws) {
        let user = await prisma.user.findFirst();
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: "owner@example.com",
              name: "Product Owner",
            },
          });
        }
        ws = await prisma.workspace.create({
          data: {
            name: "Default Workspace",
            slug: "default-" + Date.now(),
            ownerId: user.id,
          },
        });
      }
      wsId = ws.id;
    }

    const defaultQuestions = JSON.stringify([
      "Who are you and what company do you represent?",
      "What problem did our product solve for you?",
      "What is your favorite feature and why?",
    ]);

    const newSpace = await prisma.space.create({
      data: {
        name,
        slug,
        workspaceId: wsId,
        headerTitle: headerTitle || `Would you like to give a shoutout for ${name}?`,
        customMessage: customMessage || "We would love to hear your honest feedback. You can record a quick video or drop a few lines!",
        questions: questions ? (typeof questions === "string" ? questions : JSON.stringify(questions)) : defaultQuestions,
        collectionType: collectionType || "ALL",
        theme: theme || "dark",
        primaryColor: primaryColor || "#5D5FEF",
      },
    });

    return NextResponse.json({ success: true, data: newSpace }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/v1/spaces error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create space" },
      { status: 500 }
    );
  }
}
