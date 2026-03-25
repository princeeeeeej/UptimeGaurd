// src/app/api/results/[monitorId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { pingResults } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { monitorId } = await context.params;

    console.log("📥 Results API called for monitorId:", monitorId);

    const results = await db
      .select()
      .from(pingResults)
      .where(eq(pingResults.monitorId, monitorId))
      .orderBy(desc(pingResults.checkedAt))
      .limit(100);

    console.log(`📊 Found ${results.length} result(s)`);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Results API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}