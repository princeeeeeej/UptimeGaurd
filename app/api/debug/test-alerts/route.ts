// app/api/test-alert/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { monitors } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { sendAlert } from "@/lib/alerts";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the first monitor for this user
    const userMonitors = await db
      .select()
      .from(monitors)
      .where(eq(monitors.userId, userId))
      .limit(1);

    if (!userMonitors.length) {
      return NextResponse.json({ error: "No monitors found" }, { status: 404 });
    }

    const monitor = userMonitors[0];

    // Force send alert (bypass any suppression)
    console.log("🧪 Testing alert for:", monitor.name);
    
    const result = await sendAlert({
      monitorName: monitor.name,
      userId: userId,
      url: monitor.url,
      error: "TEST ALERT - Ignore this",
    });

    return NextResponse.json({
      message: "Test alert triggered",
      monitor: monitor.name,
      result,
    });
  } catch (error: any) {
    console.error("Test alert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}