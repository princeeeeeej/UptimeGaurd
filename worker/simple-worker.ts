// worker.ts
import "dotenv/config";

import { db } from "@/db";
import {
  monitors,
  pingResults,
  incidents,
  rootCauseAnalyses,
  sslChecks,
} from "@/db/schema";
import { eq, desc, and, isNull } from "drizzle-orm";
import { pingUrl } from "@/lib/ping";
import { analyzeRootCause } from "@/lib/root-cause";
import { sendAlert } from "@/lib/alerts";
import { checkSSLCertificate } from "@/lib/ssl-checker";
import { detectAnomaly } from "@/lib/anamoly";

async function checkAllMonitors() {
  try {
    const activeMonitors = await db
      .select()
      .from(monitors)
      .where(eq(monitors.isActive, true));

    if (activeMonitors.length === 0) {
      console.log("📭 No active monitors found");
      return;
    }

    console.log(`\n═══════════════════════════════════════════`);
    console.log(`🔍 Checking ${activeMonitors.length} active monitor(s)...`);
    console.log(`═══��═══════════════════════════════════════`);

    for (const monitor of activeMonitors) {
      const { id: monitorId, url, name, userId } = monitor;

      try {
        console.log(`\n🔍 Checking ${name} (${url})...`);

        // 1. Ping
        const result = await pingUrl(url);

        console.log(
          `${result.isUp ? "✅" : "❌"} ${name}: ${
            result.isUp ? "UP" : "DOWN"
          } | ${result.responseTime?.toFixed(0) ?? "N/A"}ms | HTTP ${
            result.statusCode ?? "N/A"
          }`
        );

        // 2. Save ping result
        await db.insert(pingResults).values({
          monitorId,
          statusCode: result.statusCode,
          responseTime: result.responseTime,
          isUp: result.isUp,
          errorMessage: result.errorMessage,
        });

        // 3. Anomaly detection (only if UP)
        if (result.isUp) {
          try {
            const recentResults = await db
              .select()
              .from(pingResults)
              .where(eq(pingResults.monitorId, monitorId))
              .orderBy(desc(pingResults.checkedAt))
              .limit(30);

            const anomalyResult = detectAnomaly(
              recentResults.map((r) => ({
                responseTime: r.responseTime || 0,
                checkedAt: r.checkedAt,
              }))
            );

            if (anomalyResult.severity === "critical") {
              console.log(
                `🔮 Predictive alert: possible downtime in ~${anomalyResult.predictedDowntime} min`
              );

              await sendAlert({
                monitorName: name,
                url,
                userId,
                error: `🔮 PREDICTIVE ALERT: ${anomalyResult.message}. Estimated downtime in ~${anomalyResult.predictedDowntime} minutes.`,
              });
            }
          } catch (err) {
            console.error(`Anomaly detection error for ${name}:`, err);
          }
        }

        // 4. If DOWN -> incident + root cause + alert
        if (!result.isUp) {
          console.log(`🔴 ${name} is DOWN. Analyzing...`);

          // Root cause analysis
          let rootCause = null;
          try {
            rootCause = await analyzeRootCause(url, {
              code: result.errorMessage,
              message: result.errorMessage,
              response: { status: result.statusCode },
            });
            console.log(
              `🔬 Root Cause: ${rootCause.category} — ${rootCause.description}`
            );
          } catch (err) {
            console.error(`Root cause analysis failed for ${name}:`, err);
          }

          // Check for existing active incident for THIS monitor
          const existingIncident = await db
            .select()
            .from(incidents)
            .where(
              and(
                eq(incidents.monitorId, monitorId),
                isNull(incidents.resolvedAt)
              )
            )
            .limit(1);

          const isNewIncident = existingIncident.length === 0;

          // Create incident if new
          if (isNewIncident) {
            console.log(`🆕 New incident for ${name}`);

            const newIncident = await db
              .insert(incidents)
              .values({
                monitorId,
                cause:
                  rootCause?.description ||
                  result.errorMessage ||
                  `HTTP ${result.statusCode}`,
              })
              .returning();

            if (rootCause && newIncident[0]) {
              await db.insert(rootCauseAnalyses).values({
                incidentId: newIncident[0].id,
                category: rootCause.category,
                description: rootCause.description,
                suggestion: rootCause.suggestion,
                technicalDetail: rootCause.technicalDetail,
              });
            }

            // ✅ ALWAYS alert on new incident
            try {
              await sendAlert({
                monitorName: name,
                url,
                userId,
                error: rootCause
                  ? `Root Cause: ${rootCause.description}\nSuggestion: ${rootCause.suggestion}`
                  : result.errorMessage || `HTTP ${result.statusCode}`,
              });
              console.log(`📧 Initial alert sent for ${name}`);
            } catch (err) {
              console.error(`Failed to send initial alert for ${name}:`, err);
            }
          } else {
            // Existing incident - check for escalation
            const downSince = new Date(existingIncident[0].startedAt);
            const downMinutes = Math.floor(
              (Date.now() - downSince.getTime()) / 60000
            );

            const escalationPoints = [5, 15, 30, 60, 120, 240];
            const shouldEscalate = escalationPoints.some(
              (point) => downMinutes >= point && downMinutes < point + 2
            );

            if (shouldEscalate) {
              try {
                await sendAlert({
                  monitorName: name,
                  url,
                  userId,
                  error: `⏰ STILL DOWN for ${downMinutes} minutes!\n${
                    rootCause
                      ? `Root Cause: ${rootCause.description}\nSuggestion: ${rootCause.suggestion}`
                      : result.errorMessage || `HTTP ${result.statusCode}`
                  }`,
                });
                console.log(
                  `📧 Escalation alert sent for ${name} (${downMinutes} min)`
                );
              } catch (err) {
                console.error(`Escalation alert failed for ${name}:`, err);
              }
            } else {
              const nextEscalation =
                escalationPoints.find((p) => p > downMinutes) || 480;
              console.log(
                `🔕 Suppressed: ${name} down for ${downMinutes} min. Next alert at ${nextEscalation} min.`
              );
            }
          }
        }

        // 5. If BACK UP -> resolve incident
        if (result.isUp) {
          const ongoingIncident = await db
            .select()
            .from(incidents)
            .where(
              and(
                eq(incidents.monitorId, monitorId),
                isNull(incidents.resolvedAt)
              )
            )
            .limit(1);

          if (ongoingIncident.length > 0) {
            const incident = ongoingIncident[0];

            await db
              .update(incidents)
              .set({ resolvedAt: new Date() })
              .where(eq(incidents.id, incident.id));

            const downtimeMinutes = Math.round(
              (Date.now() - new Date(incident.startedAt).getTime()) / 60000
            );

            await sendAlert({
              monitorName: name,
              url,
              userId,
              error: `✅ ${name} is BACK ONLINE!\nDowntime duration: ${downtimeMinutes} minutes`,
            });

            console.log(`✅ ${name} recovered after ${downtimeMinutes} min`);
          }
        }

        // 6. SSL check (once per 24h)
        try {
          const lastSSLCheck = await db
            .select()
            .from(sslChecks)
            .where(eq(sslChecks.monitorId, monitorId))
            .orderBy(desc(sslChecks.checkedAt))
            .limit(1);

          const shouldCheckSSL =
            !lastSSLCheck[0] ||
            Date.now() - new Date(lastSSLCheck[0].checkedAt).getTime() >
              24 * 60 * 60 * 1000;

          if (shouldCheckSSL && url.startsWith("https")) {
            console.log(`🔒 Running SSL check for ${name}...`);

            const hostname = new URL(url).hostname;
            const sslInfo = await checkSSLCertificate(hostname);

            await db.insert(sslChecks).values({
              monitorId,
              isValid: sslInfo.isValid,
              issuer: sslInfo.issuer,
              validFrom: sslInfo.validFrom,
              validTo: sslInfo.validTo,
              daysUntilExpiry: sslInfo.daysUntilExpiry,
              protocol: sslInfo.protocol,
              warning: sslInfo.warning,
            });

            console.log(
              `🔒 SSL: ${sslInfo.isValid ? "Valid" : "Invalid"} | ${
                sslInfo.daysUntilExpiry
              } days left`
            );
          }
        } catch (sslErr: any) {
          console.log(`SSL check failed for ${name}: ${sslErr.message}`);
        }

        console.log(`✔️ Completed check for ${name}`);
      } catch (monitorErr) {
        console.error(`❌ Failed checking ${name}:`, monitorErr);
      }
    }
  } catch (err) {
    console.error("Worker cycle failed:", err);
  }
}

console.log("═══════════════════════════════════════════");
console.log("🔄 UptimeGuard Worker Started");
console.log("⏱  Running every 60 seconds");
console.log("═══════════════════════════════════════════");

// Run immediately
checkAllMonitors();

// Run every 60 seconds
setInterval(checkAllMonitors, 60 * 1000);