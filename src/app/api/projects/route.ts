import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// -------------------------------------------------------------------------
// 1. GET: Fetch all projects for the logged-in user
// -------------------------------------------------------------------------
export const GET = auth(async (req) => {
  const userId = req.auth?.user?.id;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("GET_PROJECTS_ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
  }
});

// -------------------------------------------------------------------------
// 2. POST: Create a new project
// -------------------------------------------------------------------------
export const POST = auth(async (req) => {
  const userId = req.auth?.user?.id;

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ success: false, error: "Project name is required" }, { status: 400 });
    }

    // Naya project DB mein save karein
    const newProject = await prisma.project.create({
      data: {
        name: name.trim(),
        userId: userId,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        data: newProject, 
        message: "Project created successfully!" 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("CREATE_PROJECT_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project. Database error." }, 
      { status: 500 }
    );
  }
});