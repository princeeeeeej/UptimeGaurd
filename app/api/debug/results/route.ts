// app/api/debug/results/route.ts

import { NextResponse } from "next/server";
import { db } from "@/db";
import { pingResults } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const allResults = await db
    .select()
    .from(pingResults)
    .orderBy(desc(pingResults.checkedAt))
    .limit(10);

  return NextResponse.json({
    total: allResults.length,
    results: allResults,
  });
}