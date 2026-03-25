"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MonitorDetailSkeleton from "./_component/MonitorDetailSkeleton";
import IncidentBanner from "./_component/IncidentBanner";
import MonitorHeader from "./_component/MonitorHeader";
import StatsOverview from "./_component/StatsOverview";
import ResponseChart from "./_component/ResponseChart";
import RecentChecks from "./_component/RecentChecks";
import IncidentHistory from "./_component/IncidentHistory";
import SSLCard from "./_component/SSLCard";


const REFRESH_INTERVAL = 30000;

export default function MonitorDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMonitor = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);

    try {
      const res = await fetch(`/api/monitors/${id}`);

      if (!res.ok) {
        setError(res.status === 404 ? "Monitor not found" : "Failed to fetch monitor");
        return;
      }

      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch monitor:", err);
      setError("Failed to fetch monitor");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchMonitor();
      const interval = setInterval(() => fetchMonitor(), REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [id, fetchMonitor]);

  if (loading) return <MonitorDetailSkeleton />;

  if (error || !data?.monitor) {
    return (
      <div className="min-h-screen bg-[#F4EAE6] flex flex-col items-center justify-center gap-4">
        <p className="text-black/50 text-lg">{error || "Monitor not found"}</p>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-black/60 hover:text-black font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const { monitor, results, incidents, ssl, stats } = data;
  const latest = results?.[0] || null;
  const isUp = latest?.isUp ?? null;
  const isPaused = !monitor.isActive;
  const activeIncident = incidents?.find((i: any) => !i.resolvedAt) || null;

  return (
    <div className="min-h-screen bg-[#F4EAE6] text-black font-sans pb-20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-black/60 hover:text-black font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        <button
          onClick={() => fetchMonitor(true)}
          disabled={refreshing}
          className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium border border-black/10 hover:bg-black/5 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCcw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 mt-8 space-y-8">
        {activeIncident && <IncidentBanner incident={activeIncident} />}

        <MonitorHeader
          monitor={monitor}
          latest={latest}
          isUp={isUp}
          isPaused={isPaused}
          stats={stats}
        />

        <StatsOverview
          stats={stats}
          isUp={isUp}
          isPaused={isPaused}
          latest={latest}
        />

        <ResponseChart results={results} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecentChecks results={results} />
          <SSLCard ssl={ssl} />
        </div>

        <IncidentHistory incidents={incidents} />
      </main>
    </div>
  );
}