// app/api/monitors/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { monitors, pingResults } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all monitors for the user
    const userMonitors = await db
      .select()
      .from(monitors)
      .where(eq(monitors.userId, userId))
      .orderBy(desc(monitors.createdAt));

    // Fetch results for each monitor and format the data
    const monitorsWithResults = await Promise.all(
      userMonitors.map(async (monitor) => {
        // Get last 30 results for uptime bar
        const monitorResults = await db
          .select()
          .from(pingResults)
          .where(eq(pingResults.monitorId, monitor.id))
          .orderBy(desc(pingResults.checkedAt))
          .limit(30);

        const latestResult = monitorResults[0] || null;

        // Calculate uptime
        const totalChecks = monitorResults.length;
        const successfulChecks = monitorResults.filter((r) => r.isUp).length;
        const uptime =
          totalChecks > 0
            ? ((successfulChecks / totalChecks) * 100).toFixed(1)
            : "100";

        return {
          ...monitor,
          latestResult: latestResult
            ? {
                isUp: latestResult.isUp,
                responseTime: latestResult.responseTime,
                statusCode: latestResult.statusCode,
                checkedAt: latestResult.checkedAt,
              }
            : null,
          results: monitorResults.map((r) => ({
            isUp: r.isUp,
            responseTime: r.responseTime,
            createdAt: r.checkedAt,
          })),
          uptime,
        };
      })
    );

    // Calculate overview stats
    const totalMonitors = monitorsWithResults.length;
    const upMonitors = monitorsWithResults.filter(
      (m) => m.isActive && m.latestResult?.isUp === true
    ).length;
    const downMonitors = monitorsWithResults.filter(
      (m) => m.isActive && m.latestResult?.isUp === false
    ).length;

    // Return the structure dashboard expects
    return NextResponse.json({
      overview: {
        totalMonitors,
        upMonitors,
        downMonitors,
      },
      monitors: monitorsWithResults,
    });
  } catch (error: any) {
    console.error("GET monitors error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch monitors" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url, name, interval } = body;

    if (!url || !name) {
      return NextResponse.json(
        { error: "URL and name are required" },
        { status: 400 }
      );
    }

    const cleanUrl = url.startsWith("http") ? url : `https://${url}`;

    const newMonitor = await db
      .insert(monitors)
      .values({
        userId,
        url: cleanUrl,
        name,
        interval: interval || 60,
      })
      .returning();

    return NextResponse.json(newMonitor[0], { status: 201 });
  } catch (error: any) {
    console.error("POST monitor error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create monitor" },
      { status: 500 }
    );
  }
}