import React from "react";
import {
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsOverviewProps {
  stats: {
    uptime: string;
    avgResponseTime: number;
    totalChecks: number;
    successfulChecks: number;
  } | null;
  isUp: boolean | null;
  isPaused: boolean;
  latest: {
    responseTime: number | null;
  } | null;
}

export default function StatsOverview({
  stats,
  isUp,
  isPaused,
}: StatsOverviewProps) {
  const cards = [
    {
      title: "Status",
      value: isPaused ? "Paused" : isUp === null ? "Pending" : isUp ? "Up" : "Down",
      icon: isPaused ? Pause : isUp ? CheckCircle : XCircle,
      color: isPaused ? "amber" : isUp ? "emerald" : "red",
    },
    {
      title: "Uptime",
      value: `${stats?.uptime || "100"}%`,
      icon: Activity,
      color: "blue",
    },
    {
      title: "Avg Response",
      value: `${stats?.avgResponseTime || 0}ms`,
      icon: Clock,
      color: "purple",
    },
    {
      title: "Total Checks",
      value: stats?.totalChecks || 0,
      icon: CheckCircle,
      color: "neutral",
    },
  ];

  const colorMap: Record<string, { bg: string; icon: string }> = {
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-600" },
    red: { bg: "bg-red-50", icon: "text-red-600" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600" },
    blue: { bg: "bg-blue-50", icon: "text-blue-600" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600" },
    neutral: { bg: "bg-neutral-100", icon: "text-neutral-600" },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const colors = colorMap[card.color];
        return (
          <div
            key={card.title}
            className="bg-white p-5 rounded-[1.5rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-3",
                colors.bg
              )}
            >
              <card.icon size={18} className={colors.icon} />
            </div>
            <p className="text-black/40 text-xs font-bold uppercase tracking-widest mb-1">
              {card.title}
            </p>
            <p className="text-2xl font-semibold tracking-tight">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}