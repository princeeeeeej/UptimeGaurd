import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Incident {
  id: string;
  cause: string | null;
  startedAt: string;
  resolvedAt: string | null;
}

interface IncidentHistoryProps {
  incidents: Incident[] | null;
}

export default function IncidentHistory({ incidents }: IncidentHistoryProps) {
  if (!incidents || incidents.length === 0) return null;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <h3 className="font-semibold text-xl tracking-tight mb-6 flex items-center gap-2">
        <AlertTriangle className="text-amber-500" size={20} />
        Incident History
        <span className="text-sm font-medium text-black/40 ml-auto">
          {incidents.length} total
        </span>
      </h3>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {incidents.map((incident) => (
          <IncidentRow key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  );
}

function IncidentRow({ incident }: { incident: Incident }) {
  const isResolved = !!incident.resolvedAt;
  const startedAt = new Date(incident.startedAt);
  const resolvedAt = incident.resolvedAt
    ? new Date(incident.resolvedAt)
    : null;

  const duration = resolvedAt
    ? Math.round(
        (resolvedAt.getTime() - startedAt.getTime()) / 60000
      )
    : Math.round((Date.now() - startedAt.getTime()) / 60000);

  return (
    <div
      className={cn(
        "p-4 rounded-xl border transition-colors",
        isResolved
          ? "bg-emerald-50 border-emerald-100"
          : "bg-red-50 border-red-100"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                isResolved ? "bg-emerald-500" : "bg-red-500 animate-pulse"
              )}
            />
            <p className="font-medium text-sm">
              {isResolved ? "Resolved" : "Ongoing"}
            </p>
            <span className="text-xs text-black/40 font-medium">
              ({duration < 1 ? "< 1" : duration} min)
            </span>
          </div>

          {incident.cause && (
            <p className="text-sm text-black/60 mt-1 ml-4">
              {incident.cause}
            </p>
          )}
        </div>

        <div className="text-right text-sm text-black/50 ml-4 flex-shrink-0">
          <p>{startedAt.toLocaleString()}</p>
          {resolvedAt && (
            <p className="text-emerald-600">
              {resolvedAt.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}