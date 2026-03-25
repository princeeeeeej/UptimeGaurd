// src/app/api/ssl/[monitorId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { sslChecks } from "@/db/schema";
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

    const latestSSL = await db
      .select()
      .from(sslChecks)
      .where(eq(sslChecks.monitorId, monitorId))
      .orderBy(desc(sslChecks.checkedAt))
      .limit(1);

    return NextResponse.json(latestSSL[0] || null);
  } catch (error: any) {
    console.error("SSL API error:", error);
    return NextResponse.json(null);
  }
}