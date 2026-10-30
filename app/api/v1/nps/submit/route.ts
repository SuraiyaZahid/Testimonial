import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/v1/nps/submit - PRD 4.2 NPS Engine
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { spaceId, score, feedback, authorName, authorEmail } = body;

    if (!spaceId || score === undefined) {
      return NextResponse.json(
        { success: false, error: "spaceId and score are required" },
        { status: 400 }
      );
    }

    const numericScore = Number(score);
    if (numericScore < 0 || numericScore > 10) {
      return NextResponse.json(
        { success: false, error: "Score must be between 0 and 10" },
        { status: 400 }
      );
    }

    let category = "PASSIVE";
    if (numericScore >= 9) {
      category = "PROMOTER";
    } else if (numericScore <= 6) {
      category = "DETRACTOR";
    }

    const nps = await prisma.npsResponse.create({
      data: {
        spaceId,
        score: numericScore,
        category,
        feedback: feedback || "",
        authorName: authorName || "Anonymous User",
        authorEmail: authorEmail || "",
      },
    });

    // If promoter (9 or 10), suggest video testimonial prompt
    const shouldPromptVideoReview = category === "PROMOTER";

    return NextResponse.json({
      success: true,
      message: "NPS recorded successfully",
      data: nps,
      nextAction: shouldPromptVideoReview
        ? {
            action: "PROMPT_VIDEO_REVIEW",
            message: "We're thrilled you love our product! Would you mind recording a quick 60-second video shoutout?",
          }
        : {
            action: "THANK_YOU",
            message: "Thank you for helping us improve our product!",
          },
    });
  } catch (error: any) {
    console.error("POST /api/v1/nps/submit error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record NPS response" },
      { status: 500 }
    );
  }
}
