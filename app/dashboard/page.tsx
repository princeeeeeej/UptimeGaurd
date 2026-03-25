"use client";

import React, { useEffect, useState, useCallback } from "react";
import DashboardSkeleton from "./_component/DashboardSkeleton";
import DashboardNav from "./_component/DashboardNav";
import DashboardHeader from "./_component/DashboardHeader";
import StatsGrid from "./_component/StatsGrid";
import MonitorsGrid from "./_component/MonitorsGrid";
import AddMonitorModal from "./_component/AddMonitorModal";


const REFRESH_INTERVAL = 30000;

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/monitors");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleToggle = async (id: string, currentlyActive: boolean) => {
    await fetch(`/api/monitors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentlyActive }),
    });
    fetchData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    await fetch(`/api/monitors/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleMonitorAdded = () => {
    fetchData();
    setIsModalOpen(false);
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-[#F4EAE6] text-black font-sans selection:bg-black selection:text-white pb-20 overflow-x-hidden">
      <DashboardNav onNewMonitor={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-8 mt-12">
        <DashboardHeader />

        <StatsGrid overview={data?.overview} />

        <MonitorsGrid
          monitors={data?.monitors}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onAddFirst={() => setIsModalOpen(true)}
        />
      </main>

      {isModalOpen && (
        <AddMonitorModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleMonitorAdded}
        />
      )}
    </div>
  );
}