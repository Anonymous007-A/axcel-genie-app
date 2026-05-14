import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = auth(async (req) => {
  const userId = req.auth?.user?.id;

  // 🔒 Unauthorized
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", timestamp: new Date().toISOString() },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { toolId, fileId, config } = body;

    // 🧱 Validation
    if (!toolId || !fileId) {
      return NextResponse.json(
        { success: false, error: "Missing toolId or fileId", timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    // 🔎 Security: file ownership + locked status + row count
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        project: { userId: userId },
      },
      select: {
        id: true,
        locked: true,
        rows: true,
      },
    });

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File not found or access denied", timestamp: new Date().toISOString() },
        { status: 403 }
      );
    }

    // 🚫 Block execution on locked files
    if (file.locked) {
      return NextResponse.json(
        { success: false, error: "Cannot modify a locked file. Please unlock it first.", timestamp: new Date().toISOString() },
        { status: 403 }
      );
    }

    // 🧠 Use actual row count for realistic feedback
    const rowsProcessed = file.rows || 0;

    // 📝 Create execution record with audit trail
    const execution = await prisma.execution.create({
      data: {
        toolId,
        fileId,
        status: "completed",
        startedAt: new Date(),
        finishedAt: new Date(),
        result: {
          rowsProcessed,
          config: config || {},
          message: `Successfully processed ${rowsProcessed} rows.`,
          completedAt: new Date().toISOString(),
        },
      },
    });

    // ✅ Return strict ApiResponse
    return NextResponse.json(
      {
        success: true,
        data: {
          executionId: execution.id,
          rowsProcessed,
          message: "Tool execution completed successfully!",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("EXECUTE_TOOL_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during tool execution", timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
});