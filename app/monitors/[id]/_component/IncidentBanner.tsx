import React from "react";
import { AlertTriangle } from "lucide-react";

interface IncidentBannerProps {
  incident: {
    cause: string | null;
    startedAt: string;
  };
}

export default function IncidentBanner({ incident }: IncidentBannerProps) {
  const startedAt = new Date(incident.startedAt);
  const downMinutes = Math.floor(
    (Date.now() - startedAt.getTime()) / 60000
  );

  return (
    <div className="bg-red-500 text-white p-6 rounded-[2rem] shadow-lg flex items-start gap-4 animate-in fade-in duration-300">
      <AlertTriangle className="mt-1 flex-shrink-0" size={24} />
      <div className="flex-1">
        <h3 className="font-bold text-lg tracking-tight">
          Active Incident: {incident.cause || "Unknown"}
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
          <p className="text-white/80 text-sm">
            Started: {startedAt.toLocaleString()}
          </p>
          <p className="text-white/80 text-sm">
            Duration: {downMinutes < 1 ? "< 1 min" : `${downMinutes} min`}
          </p>
        </div>
      </div>
    </div>
  );
}