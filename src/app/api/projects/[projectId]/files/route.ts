import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> } 
) {
  try {
    const { projectId } = await params;
    const files = await prisma.file.findMany({
      where: { projectId: projectId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: files }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> } 
) {
  try {
    const { projectId } = await params;
    const body = await request.json();
    const { name, size, type } = body;

    if (!name || size === undefined) {
      return NextResponse.json({ success: false, error: "Missing details" }, { status: 400 });
    }

    // Direct save - Iske liye zaroori hai ki aapne Dashboard se project pehle hi bana liya ho
    const newFile = await prisma.file.create({
      data: {
        name,
        size: typeof size === "number" ? size : parseInt(size) || 0,
        type: type || "unknown",
        projectId: projectId, 
      },
    });

    return NextResponse.json({ success: true, data: newFile }, { status: 201 });
  } catch (error) {
    console.error("POST file error:", error);
    return NextResponse.json({ success: false, error: "Database save failed" }, { status: 500 });
  }
}