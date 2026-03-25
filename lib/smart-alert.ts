import { db } from "@/db";
import { incidents, pingResults } from "@/db/schema";
import { eq, desc, and, gte } from "drizzle-orm";

interface SmartAlertDecision {
  shouldSendAlert: boolean;
  reason: string;
  alertType: "initial" | "escalation" | "resolved" | "suppressed";
}

export async function shouldSendAlert(
  monitorId: string,
  isCurrentlyDown: boolean
): Promise<SmartAlertDecision> {

  // Get recent incidents for this monitor
  const recentIncidents = await db
    .select()
    .from(incidents)
    .where(eq(incidents.monitorId, monitorId))
    .orderBy(desc(incidents.startedAt))
    .limit(5);

  const ongoingIncident = recentIncidents.find((i) => !i.resolvedAt);

  // CASE 1: Site just went down (no ongoing incident)
  if (isCurrentlyDown && !ongoingIncident) {
    return {
      shouldSendAlert: true,
      reason: "New downtime detected",
      alertType: "initial",
    };
  }

  // CASE 2: Site is still down and incident exists
  if (isCurrentlyDown && ongoingIncident) {
    const incidentDuration =
      Date.now() - new Date(ongoingIncident.startedAt).getTime();
    const minutesDown = incidentDuration / (1000 * 60);

    // Escalation alerts: send at 5min, 15min, 30min, 1hr, 2hr
    // NOT every 60 seconds like dumb tools do
    const escalationPoints = [5, 15, 30, 60, 120];

    for (const point of escalationPoints) {
      // Check if we're within 1 minute of an escalation point
      if (Math.abs(minutesDown - point) < 1) {
        return {
          shouldSendAlert: true,
          reason: `Site has been down for ${point} minutes (escalation)`,
          alertType: "escalation",
        };
      }
    }

    // Suppress the alert — already notified, not at escalation point
    return {
      shouldSendAlert: false,
      reason: `Already alerted. Next escalation check in progress. Down for ${minutesDown.toFixed(0)} minutes.`,
      alertType: "suppressed",
    };
  }

  // CASE 3: Site just came back up
  if (!isCurrentlyDown && ongoingIncident) {
    return {
      shouldSendAlert: true,
      reason: "Website is back online",
      alertType: "resolved",
    };
  }

  // CASE 4: Site is up, no incident — all good
  return {
    shouldSendAlert: false,
    reason: "Everything normal",
    alertType: "suppressed",
  };
}