// app/api/monitors/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { monitors, pingResults, incidents, sslChecks } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Fetch the monitor
    const monitorData = await db
      .select()
      .from(monitors)
      .where(and(eq(monitors.id, id), eq(monitors.userId, userId)))
      .limit(1);

    if (!monitorData || monitorData.length === 0) {
      return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
    }

    const monitor = monitorData[0];

    // Fetch ping results (last 100)
    const results = await db
      .select()
      .from(pingResults)
      .where(eq(pingResults.monitorId, id))
      .orderBy(desc(pingResults.checkedAt))
      .limit(100);

    // Fetch incidents
    const monitorIncidents = await db
      .select()
      .from(incidents)
      .where(eq(incidents.monitorId, id))
      .orderBy(desc(incidents.startedAt))
      .limit(20);

    // Fetch latest SSL check
    const sslData = await db
      .select()
      .from(sslChecks)
      .where(eq(sslChecks.monitorId, id))
      .orderBy(desc(sslChecks.checkedAt))
      .limit(1);

    // Calculate stats
    const totalChecks = results.length;
    const successfulChecks = results.filter((r) => r.isUp).length;
    const uptime = totalChecks > 0
      ? ((successfulChecks / totalChecks) * 100).toFixed(2)
      : "100";

    const avgResponseTime = totalChecks > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / totalChecks
        )
      : 0;

    return NextResponse.json({
      monitor,
      results,
      incidents: monitorIncidents,
      ssl: sslData[0] || null,
      stats: {
        uptime,
        avgResponseTime,
        totalChecks,
        successfulChecks,
      },
    });
  } catch (error: any) {
    console.error("GET monitor error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch monitor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: any
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    await db
      .delete(monitors)
      .where(and(eq(monitors.id, id), eq(monitors.userId, userId)));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: any
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const updated = await db
      .update(monitors)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(monitors.id, id), eq(monitors.userId, userId)))
      .returning();

    return NextResponse.json(updated[0] || null);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}