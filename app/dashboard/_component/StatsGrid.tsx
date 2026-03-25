import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Overview {
  totalMonitors: number;
  upMonitors: number;
  downMonitors: number;
}

interface StatsGridProps {
  overview: Overview | undefined;
}

export default function StatsGrid({ overview }: StatsGridProps) {
  const stats = [
    {
      title: "Total Monitors",
      value: overview?.totalMonitors || 0,
      trend: undefined,
      alert: false,
    },
    {
      title: "Currently Up",
      value: overview?.upMonitors || 0,
      trend: "up" as const,
      alert: false,
    },
    {
      title: "Currently Down",
      value: overview?.downMonitors || 0,
      trend: (overview?.downMonitors || 0) > 0 ? ("down" as const) : undefined,
      alert: (overview?.downMonitors || 0) > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
  alert = false,
}: {
  title: string;
  value: number;
  trend?: "up" | "down";
  alert?: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <p className="text-black/50 text-sm font-medium mb-4">{title}</p>
      <div className="flex items-end justify-between">
        <h3
          className={cn(
            "text-4xl font-semibold tracking-tighter",
            alert ? "text-red-500" : "text-black"
          )}
        >
          {value}
        </h3>
        {trend && <TrendIcon trend={trend} />}
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" }) {
  return (
    <span
      className={cn(
        "flex items-center text-sm font-medium",
        trend === "up" ? "text-emerald-500" : "text-red-500"
      )}
    >
      {trend === "up" ? (
        <ArrowUpRight size={18} />
      ) : (
        <ArrowDownRight size={18} />
      )}
    </span>
  );
}