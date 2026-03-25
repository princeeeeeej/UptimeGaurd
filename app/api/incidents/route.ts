// src/app/api/incidents/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { incidents, monitors, rootCauseAnalyses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 1: Get all monitors for this user
    const userMonitors = await db
      .select()
      .from(monitors)
      .where(eq(monitors.userId, userId));

    if (userMonitors.length === 0) {
      return NextResponse.json([]);
    }

    // Step 2: Get incidents for each monitor
    const allIncidents = [];

    for (const monitor of userMonitors) {
      const monitorIncidents = await db
        .select()
        .from(incidents)
        .where(eq(incidents.monitorId, monitor.id))
        .orderBy(desc(incidents.startedAt))
        .limit(20);

      for (const incident of monitorIncidents) {
        // Step 3: Get root cause for each incident
        let rootCause = null;
        try {
          const rootCauseResult = await db
            .select()
            .from(rootCauseAnalyses)
            .where(eq(rootCauseAnalyses.incidentId, incident.id))
            .limit(1);

          rootCause = rootCauseResult[0] || null;
        } catch {
          // rootCauseAnalyses table might not have data yet
          rootCause = null;
        }

        // Step 4: Calculate duration
        const duration = incident.resolvedAt
          ? Math.round(
              (new Date(incident.resolvedAt).getTime() -
                new Date(incident.startedAt).getTime()) /
                60000
            )
          : null;

        allIncidents.push({
          ...incident,
          monitorName: monitor.name,
          monitorUrl: monitor.url,
          monitorId: monitor.id,
          rootCause,
          duration,
        });
      }
    }

    // Step 5: Sort by newest first
    allIncidents.sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    return NextResponse.json(allIncidents);
  } catch (error: any) {
    console.error("Incidents API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch incidents" },
      { status: 500 }
    );
  }
}