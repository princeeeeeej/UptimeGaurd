// src/app/api/debug/route.ts

import { NextResponse } from "next/server";
import { db } from "@/db";
import { pingResults, monitors } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    // Get ALL ping results (no filter)
    const allResults = await db
      .select()
      .from(pingResults)
      .orderBy(desc(pingResults.checkedAt))
      .limit(10);

    // Get ALL monitors
    const allMonitors = await db
      .select()
      .from(monitors)
      .limit(10);

    return NextResponse.json({
      totalResults: allResults.length,
      results: allResults,
      totalMonitors: allMonitors.length,
      monitors: allMonitors.map((m) => ({ id: m.id, name: m.name })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}