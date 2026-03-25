import React from "react";
import { cn } from "@/lib/utils";

interface PingResult {
  checkedAt: string;
  responseTime: number | null;
  statusCode: number | null;
  isUp: boolean;
  errorMessage: string | null;
}

interface RecentChecksProps {
  results: PingResult[] | null;
}

const MAX_VISIBLE = 20;

export default function RecentChecks({ results }: RecentChecksProps) {
  const checks = results?.slice(0, MAX_VISIBLE) || [];

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-xl tracking-tight">Recent Checks</h3>
        {results && results.length > 0 && (
          <span className="text-sm text-black/40 font-medium">
            {results.length} total
          </span>
        )}
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
        {checks.length > 0 ? (
          checks.map((r, i) => <CheckRow key={i} result={r} />)
        ) : (
          <EmptyChecksState />
        )}
      </div>
    </div>
  );
}

function CheckRow({ result }: { result: PingResult }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-black/5 last:border-0">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "w-2 h-2 rounded-full flex-shrink-0",
            result.isUp ? "bg-emerald-500" : "bg-red-500"
          )}
        />
        <span className="font-medium text-sm text-black/70">
          {new Date(result.checkedAt).toLocaleTimeString()}
        </span>
      </div>

      <span className="font-medium text-sm text-black/50">
        HTTP {result.statusCode || "N/A"}
      </span>

      <span
        className={cn(
          "font-semibold text-sm",
          !result.isUp && "text-red-500"
        )}
      >
        {result.responseTime
          ? `${Math.round(result.responseTime)}ms`
          : result.errorMessage || "Error"}
      </span>
    </div>
  );
}

function EmptyChecksState() {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-4">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-black/30"
        >
          <path d="M12 2v20M2 12h20" />
        </svg>
      </div>
      <p className="text-black/40 text-sm font-medium">
        No checks recorded yet
      </p>
      <p className="text-black/25 text-xs mt-1">
        Checks will appear here once monitoring starts
      </p>
    </div>
  );
}