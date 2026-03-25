import React from "react";
import { cn } from "@/lib/utils";

interface MonitorHeaderProps {
  monitor: {
    name: string;
    url: string;
    isActive: boolean;
  };
  latest: {
    isUp: boolean;
    responseTime: number | null;
  } | null;
  isUp: boolean | null;
  isPaused: boolean;
  stats: {
    uptime: string;
  } | null;
}

export default function MonitorHeader({
  monitor,
  latest,
  isUp,
  isPaused,
  stats,
}: MonitorHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      {/* Left: Status + Name */}
      <div>
        <StatusBadge isUp={isUp} isPaused={isPaused} />
        <h1 className="text-5xl md:text-7xl font-medium tracking-tighter mb-2">
          {monitor.name}
        </h1>
        <a
          href={monitor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/50 text-lg font-medium hover:text-black transition-colors"
        >
          {monitor.url}
        </a>
      </div>

      {/* Right: Quick Stats */}
      <div className="flex gap-8 text-right">
        <div>
          <p className="text-black/40 text-sm font-medium mb-1">
            Current Response
          </p>
          <p
            className={cn(
              "text-3xl font-semibold tracking-tight",
              isUp === false && "text-red-500"
            )}
          >
            {latest?.responseTime
              ? `${Math.round(latest.responseTime)}ms`
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-black/40 text-sm font-medium mb-1">Uptime</p>
          <p className="text-3xl font-semibold tracking-tight">
            {stats?.uptime || "100"}%
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  isUp,
  isPaused,
}: {
  isUp: boolean | null;
  isPaused: boolean;
}) {
  const config = isPaused
    ? {
        bg: "bg-amber-500/10",
        text: "text-amber-700",
        border: "border-amber-500/20",
        label: "Paused",
        dotColor: "",
        showDot: false,
      }
    : isUp === null
    ? {
        bg: "bg-neutral-500/10",
        text: "text-neutral-700",
        border: "border-neutral-500/20",
        label: "Waiting",
        dotColor: "",
        showDot: false,
      }
    : isUp
    ? {
        bg: "bg-emerald-500/10",
        text: "text-emerald-700",
        border: "border-emerald-500/20",
        label: "Operational",
        dotColor: "bg-emerald-500",
        showDot: true,
      }
    : {
        bg: "bg-red-500/10",
        text: "text-red-700",
        border: "border-red-500/20",
        label: "Offline",
        dotColor: "bg-red-500",
        showDot: true,
      };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border",
        config.bg,
        config.text,
        config.border
      )}
    >
      {config.showDot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            config.dotColor
          )}
        />
      )}
      {config.label}
    </div>
  );
}