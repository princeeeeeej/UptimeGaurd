import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MonitorResult {
  isUp: boolean;
  responseTime: number | null;
}

interface Monitor {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  uptime: string;
  latestResult: MonitorResult | null;
  results: MonitorResult[];
}

interface MonitorCardProps {
  monitor: Monitor;
  onToggle: () => void;
  onDelete: () => void;
}

export default function MonitorCard({
  monitor,
  onToggle,
  onDelete,
}: MonitorCardProps) {
  const isUp = monitor.latestResult?.isUp ?? null;
  const isPaused = !monitor.isActive;

  return (
    <div
      className={cn(
        "bg-white p-6 rounded-[2rem] border shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        "transition-all duration-300 relative group flex flex-col justify-between",
        isPaused
          ? "border-black/5 opacity-70"
          : isUp === false
          ? "border-red-200"
          : "border-black/5 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]"
      )}
    >
      {/* Hover Actions */}
      <QuickActions
        isPaused={isPaused}
        onToggle={onToggle}
        onDelete={onDelete}
      />

      {/* Top Section */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <StatusDot isUp={isUp} isPaused={isPaused} />
          <Link href={`/monitors/${monitor.id}`}>
            <h3 className="text-xl font-semibold tracking-tight hover:underline decoration-2 underline-offset-4 cursor-pointer">
              {monitor.name}
            </h3>
          </Link>
        </div>
        <p className="text-black/40 text-sm ml-6 mb-8">{monitor.url}</p>
      </div>

      {/* Bottom Section */}
      <div>
        <StatusBar
          isUp={isUp}
          isPaused={isPaused}
          responseTime={monitor.latestResult?.responseTime}
        />
        <UptimeBar results={monitor.results} />
        <CardFooter monitorId={monitor.id} uptime={monitor.uptime} />
      </div>
    </div>
  );
}

function QuickActions({
  isPaused,
  onToggle,
  onDelete,
}: {
  isPaused: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
      <button
        onClick={onToggle}
        className="text-xs bg-black/5 hover:bg-black/10 px-3 py-1.5 rounded-full font-medium transition-colors"
      >
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button
        onClick={onDelete}
        className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-full font-medium transition-colors"
      >
        Delete
      </button>
    </div>
  );
}

function StatusDot({
  isUp,
  isPaused,
}: {
  isUp: boolean | null;
  isPaused: boolean;
}) {
  return (
    <div className="relative flex h-3 w-3">
      {isUp === true && !isPaused && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      )}
      <span
        className={cn(
          "relative inline-flex rounded-full h-3 w-3",
          isPaused
            ? "bg-amber-400"
            : isUp === null
            ? "bg-neutral-300"
            : isUp
            ? "bg-emerald-500"
            : "bg-red-500"
        )}
      />
    </div>
  );
}

function StatusBar({
  isUp,
  isPaused,
  responseTime,
}: {
  isUp: boolean | null;
  isPaused: boolean;
  responseTime: number | null | undefined;
}) {
  const statusText = isPaused
    ? "Paused"
    : isUp === null
    ? "Waiting for data"
    : isUp
    ? "Operational"
    : "Offline";

  return (
    <div className="flex justify-between items-end mb-4">
      <div>
        <p className="text-black/40 text-xs font-bold uppercase tracking-widest mb-1">
          Status
        </p>
        <p className="font-medium text-sm">{statusText}</p>
      </div>
      <div className="text-right">
        <p
          className={cn(
            "text-2xl font-semibold tracking-tight",
            isUp === false && "text-red-500"
          )}
        >
          {responseTime ? `${Math.round(responseTime)}ms` : "—"}
        </p>
        <p className="text-black/40 text-xs font-bold uppercase tracking-widest">
          Response
        </p>
      </div>
    </div>
  );
}

function UptimeBar({ results }: { results: MonitorResult[] }) {
  if (!results || results.length === 0) {
    return (
      <div className="h-8 w-full flex gap-1 items-end pt-2">
        <div className="h-full w-full bg-black/5 rounded-sm" />
      </div>
    );
  }

  return (
    <div className="h-8 w-full flex gap-1 items-end pt-2">
      {results
        .slice(0, 30)
        .reverse()
        .map((r, i) => (
          <div
            key={i}
            title={r.responseTime ? `${Math.round(r.responseTime)}ms` : "N/A"}
            className={cn(
              "h-full flex-1 rounded-sm transition-colors",
              r.isUp ? "bg-emerald-400" : "bg-red-500"
            )}
          />
        ))}
    </div>
  );
}

function CardFooter({
  monitorId,
  uptime,
}: {
  monitorId: string;
  uptime: string;
}) {
  return (
    <div className="flex justify-between text-[11px] font-bold text-black/30 mt-2 uppercase tracking-wider">
      <span>{uptime || 0}% Uptime</span>
      <Link
        href={`/monitors/${monitorId}`}
        className="hover:text-black transition-colors"
      >
        View Details →
      </Link>
    </div>
  );
}