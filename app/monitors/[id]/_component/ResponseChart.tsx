"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PingResult {
  checkedAt: string;
  responseTime: number | null;
  isUp: boolean;
}

interface ResponseChartProps {
  results: PingResult[] | null;
}

export default function ResponseChart({ results }: ResponseChartProps) {
  const chartData = useMemo(() => {
    if (!results || results.length === 0) return [];

    return [...results].reverse().map((r) => ({
      time: new Date(r.checkedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      response: r.responseTime || 0,
      isUp: r.isUp,
    }));
  }, [results]);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-semibold text-xl tracking-tight">
          Response Time History
        </h3>
        <span className="text-sm font-medium text-black/40 bg-black/5 px-4 py-1.5 rounded-full">
          Last {results?.length || 0} Checks
        </span>
      </div>

      <div className="h-[300px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorResponse"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#000",
                  opacity: 0.4,
                  fontSize: 12,
                  fontWeight: 500,
                }}
                dy={10}
                minTickGap={30}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#000",
                  opacity: 0.4,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{
                  stroke: "rgba(0,0,0,0.1)",
                  strokeWidth: 2,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="response"
                stroke="#000000"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorResponse)"
                activeDot={{
                  r: 6,
                  fill: "#000",
                  stroke: "#fff",
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState />
        )}
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-black text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10">
      <p className="text-white/60 text-xs font-bold mb-1">{label}</p>
      <p className="text-lg font-semibold tracking-tight">
        {Math.round(payload[0].value)}{" "}
        <span className="text-sm font-medium text-white/50">ms</span>
      </p>
    </div>
  );
}

function EmptyChartState() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-black/30 font-medium gap-2">
      <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-40"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>
      <p>No response data yet</p>
      <p className="text-sm text-black/20">
        Data will appear after the first check
      </p>
    </div>
  );
}