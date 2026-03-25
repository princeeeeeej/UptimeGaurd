"use client";

import React, { useEffect, useState } from "react";
import { Plus, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/monitors");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (id: string, currentlyActive: boolean) => {
    await fetch(`/api/monitors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentlyActive }),
    });
    fetchData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    await fetch(`/api/monitors/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#F4EAE6] text-black font-sans selection:bg-black selection:text-white pb-20">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-medium tracking-tight flex items-center gap-2">
          <Activity size={20} /> UptimeGuard
        </h1>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> New Monitor
          </button>
          <UserButton  />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 mt-12">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-4">
            <span className="text-black/40">Status Overview.</span><br />
            Everything at a glance.
          </h2>
          <p className="text-black/60 font-medium">Monitors your websites, APIs and servers 24/7.</p>
        </div>

        {/* Global Stats */}
        {loading ? (
           <div className="animate-pulse flex gap-6 mb-12 h-32 bg-black/5 rounded-[2rem]"></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard title="Total Monitors" value={data?.overview.totalMonitors || 0} />
            <StatCard 
              title="Currently Up" 
              value={data?.overview.upMonitors || 0} 
              trend="up" 
            />
            <StatCard 
              title="Currently Down" 
              value={data?.overview.downMonitors || 0} 
              trend={data?.overview.downMonitors > 0 ? "down" : undefined} 
              alert={data?.overview.downMonitors > 0} 
            />
          </div>
        )}

        {/* Monitors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
             <>
               <div className="h-64 bg-black/5 rounded-[2rem] animate-pulse"></div>
               <div className="h-64 bg-black/5 rounded-[2rem] animate-pulse"></div>
             </>
          ) : data?.monitors?.length === 0 ? (
            <div className="col-span-2 text-center py-20 bg-white rounded-[2rem] border border-black/5">
              <p className="text-black/50 mb-4">No monitors found.</p>
              <button onClick={() => setIsModalOpen(true)} className="bg-black text-white px-6 py-2.5 rounded-full text-sm">Add your first monitor</button>
            </div>
          ) : (
            data?.monitors?.map((monitor: any) => (
              <MonitorCard 
                key={monitor.id} 
                monitor={monitor} 
                onToggle={() => handleToggle(monitor.id, monitor.isActive)}
                onDelete={() => handleDelete(monitor.id, monitor.name)}
              />
            ))
          )}
        </div>
      </main>

      {isModalOpen && (
        <AddMonitorModal onClose={() => setIsModalOpen(false)} onAdd={fetchData} />
      )}
    </div>
  );
}

// --- Sub Components ---

function StatCard({ title, value, trend, alert = false }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <p className="text-black/50 text-sm font-medium mb-4">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className={cn("text-4xl font-semibold tracking-tighter", alert ? 'text-red-500' : 'text-black')}>
          {value}
        </h3>
        {trend && (
          <span className={cn("flex items-center text-sm font-medium", trend === 'up' ? 'text-emerald-500' : 'text-red-500')}>
            {trend === 'up' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
          </span>
        )}
      </div>
    </div>
  );
}

function MonitorCard({ monitor, onToggle, onDelete }: any) {
  const isUp = monitor.latestResult?.isUp ?? null;
  const isPaused = !monitor.isActive;

  return (
    <div className={cn(
      "bg-white p-6 rounded-[2rem] border shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 relative group flex flex-col justify-between",
      isPaused ? "border-black/5 opacity-70" : isUp === false ? "border-red-200" : "border-black/5 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]"
    )}>
      
      {/* Quick Actions (Appear on Hover) */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button onClick={onToggle} className="text-xs bg-black/5 hover:bg-black/10 px-3 py-1.5 rounded-full font-medium">
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={onDelete} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-full font-medium">
          Delete
        </button>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="relative flex h-3 w-3">
            {isUp === true && !isPaused && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={cn(
              "relative inline-flex rounded-full h-3 w-3",
              isPaused ? "bg-amber-400" : isUp === null ? "bg-neutral-300" : isUp ? 'bg-emerald-500' : 'bg-red-500'
            )}></span>
          </div>
          <Link href={`/monitors/${monitor.id}`}>
            <h3 className="text-xl font-semibold tracking-tight hover:underline decoration-2 underline-offset-4 cursor-pointer">{monitor.name}</h3>
          </Link>
        </div>
        <p className="text-black/40 text-sm ml-6 mb-8">{monitor.url}</p>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
             <p className="text-black/40 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
             <p className="font-medium text-sm">
               {isPaused ? "Paused" : isUp === null ? "Waiting for data" : isUp ? "Operational" : "Offline"}
             </p>
          </div>
          <div className="text-right">
            <p className={cn("text-2xl font-semibold tracking-tight", isUp === false && "text-red-500")}>
              {monitor.latestResult?.responseTime ? `${monitor.latestResult.responseTime}ms` : '—'}
            </p>
            <p className="text-black/40 text-xs font-bold uppercase tracking-widest">Response</p>
          </div>
        </div>

        {/* Real Uptime Bar */}
        <div className="h-8 w-full flex gap-1 items-end pt-2">
          {monitor.results && monitor.results.length > 0 ? (
             monitor.results.slice(0, 30).reverse().map((r: any, i: number) => (
                <div 
                  key={i} 
                  title={`${r.responseTime}ms`}
                  className={cn("h-full flex-1 rounded-sm", r.isUp ? "bg-emerald-400" : "bg-red-500")}
                />
             ))
          ) : (
            <div className="h-full w-full bg-black/5 rounded-sm"></div>
          )}
        </div>
        <div className="flex justify-between text-[11px] font-bold text-black/30 mt-2 uppercase tracking-wider">
          <span>{monitor.uptime || 0}% Uptime</span>
          <Link href={`/monitors/${monitor.id}`} className="hover:text-black">View Details →</Link>
        </div>
      </div>
    </div>
  );
}

// Add Monitor Modal
function AddMonitorModal({ onClose, onAdd }: { onClose: () => void, onAdd: () => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/monitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url: url.startsWith("http") ? url : `https://${url}`, interval: 60 }),
    });
    setLoading(false);
    onAdd();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Add Monitor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-black/50 mb-2 block">Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Production API" className="w-full bg-[#F4EAE6] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/5 transition-all" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-black/50 mb-2 block">URL</label>
            <input required type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="example.com" className="w-full bg-[#F4EAE6] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/5 transition-all" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-black/5 text-black font-medium py-3 rounded-full hover:bg-black/10 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-black text-white font-medium py-3 rounded-full hover:bg-neutral-800 transition-colors disabled:opacity-50">
              {loading ? "Adding..." : "Add Monitor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}