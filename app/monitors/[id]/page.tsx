// app/monitors/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, RefreshCcw, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export default function MonitorDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const res = await fetch(`/api/monitors/${id}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setError("Monitor not found");
        } else {
          setError("Failed to fetch monitor");
        }
        return;
      }
      
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch monitor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4EAE6] flex items-center justify-center">
        <div className="animate-pulse text-black/50 tracking-widest uppercase text-sm font-bold">
          Loading Data...
        </div>
      </div>
    );
  }

  if (error || !data?.monitor) {
    return (
      <div className="min-h-screen bg-[#F4EAE6] flex flex-col items-center justify-center gap-4">
        <p className="text-black/50">{error || "Monitor not found"}</p>
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
  const latest = results?.[0];
  const isUp = latest?.isUp ?? null;
  const isPaused = !monitor.isActive;
  const activeIncident = incidents?.find((i: any) => !i.resolvedAt);

  // Format chart data (reverse so oldest is left)
  const chartData = [...(results || [])].reverse().map((r: any) => ({
    time: new Date(r.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    response: r.responseTime || 0,
    isUp: r.isUp
  }));

  return (
    <div className="min-h-screen bg-[#F4EAE6] text-black font-sans pb-20">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-black/60 hover:text-black font-medium transition-colors">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        <button onClick={fetchAll} className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium border border-black/10 hover:bg-black/5 transition-colors flex items-center gap-2">
          <RefreshCcw size={14} /> Refresh
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 mt-8">
        
        {/* Active Incident Banner */}
        {activeIncident && (
          <div className="bg-red-500 text-white p-6 rounded-[2rem] mb-8 shadow-lg flex items-start gap-4">
            <AlertTriangle className="mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg tracking-tight">Active Incident: {activeIncident.cause || "Unknown"}</h3>
              <p className="text-white/80 mt-1">Started {new Date(activeIncident.startedAt).toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border",
              isPaused ? "bg-amber-500/10 text-amber-700 border-amber-500/20" :
              isUp === null ? "bg-neutral-500/10 text-neutral-700 border-neutral-500/20" :
              isUp ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-red-500/10 text-red-700 border-red-500/20"
            )}>
              {!isPaused && isUp !== null && <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isUp ? "bg-emerald-500" : "bg-red-500")}></span>}
              {isPaused ? "Paused" : isUp === null ? "Waiting" : isUp ? "Operational" : "Offline"}
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter mb-2">{monitor.name}</h1>
            <p className="text-black/50 text-lg font-medium">{monitor.url}</p>
          </div>
          
          <div className="flex gap-8 text-right">
            <div>
              <p className="text-black/40 text-sm font-medium mb-1">Current Response</p>
              <p className={cn("text-3xl font-semibold tracking-tight", isUp === false && "text-red-500")}>
                {latest?.responseTime ? `${Math.round(latest.responseTime)}ms` : '—'}
              </p>
            </div>
            <div>
              <p className="text-black/40 text-sm font-medium mb-1">Uptime</p>
              <p className="text-3xl font-semibold tracking-tight">{stats?.uptime || 100}%</p>
            </div>
          </div>
        </div>

        {/* Response Time Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-semibold text-xl tracking-tight">Response Time History</h3>
            <span className="text-sm font-medium text-black/40 bg-black/5 px-4 py-1.5 rounded-full">Last {results?.length || 0} Checks</span>
          </div>
          
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#000', opacity: 0.4, fontSize: 12, fontWeight: 500 }} dy={10} minTickGap={30}/>
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#000', opacity: 0.4, fontSize: 12, fontWeight: 500 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="response" stroke="#000000" strokeWidth={3} fillOpacity={1} fill="url(#colorResponse)" activeDot={{ r: 6, fill: "#000", stroke: "#fff", strokeWidth: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-black/30 font-medium">No response data yet.</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Checks List */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
             <h3 className="font-semibold text-xl tracking-tight mb-6">Recent Checks</h3>
             <div className="space-y-1 max-h-96 overflow-y-auto">
                {results && results.length > 0 ? results.slice(0, 20).map((r: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-black/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={cn("w-2 h-2 rounded-full", r.isUp ? "bg-emerald-500" : "bg-red-500")}></span>
                      <span className="font-medium text-sm text-black/70">{new Date(r.checkedAt).toLocaleTimeString()}</span>
                    </div>
                    <span className="font-medium text-sm text-black/50">HTTP {r.statusCode || 'N/A'}</span>
                    <span className={cn("font-semibold text-sm", !r.isUp && "text-red-500")}>
                      {r.responseTime ? `${Math.round(r.responseTime)}ms` : r.errorMessage || 'Error'}
                    </span>
                  </div>
                )) : (
                  <p className="text-black/40 text-sm text-center py-8">No checks recorded yet. Checks will appear here once monitoring starts.</p>
                )}
             </div>
          </div>

          {/* SSL Card */}
          <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            
            <div>
              <h3 className="font-semibold text-xl tracking-tight mb-8 flex items-center gap-2">
                {ssl?.isValid ? <ShieldCheck className="text-emerald-400"/> : <ShieldAlert className="text-red-400"/>}
                SSL Certificate
              </h3>
              
              {ssl ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
                    <p className="font-medium flex items-center gap-2">
                      <span className={cn("w-2 h-2 rounded-full", ssl.isValid ? "bg-emerald-400" : "bg-red-400")}></span> 
                      {ssl.isValid ? "Valid" : "Invalid/Expired"}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Issuer</p>
                    <p className="font-medium">{ssl.issuer || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Expires In</p>
                    <p className={cn("text-3xl font-semibold tracking-tight", ssl.daysUntilExpiry < 14 && "text-amber-400", ssl.daysUntilExpiry <= 0 && "text-red-400")}>
                      {ssl.daysUntilExpiry > 0 ? `${ssl.daysUntilExpiry} Days` : "Expired"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-white/50 text-sm">SSL check runs periodically. Data will appear after the first check.</p>
              )}
            </div>
            
            <p className="mt-8 text-xs text-white/30 text-center font-medium">
              Checked: {ssl ? new Date(ssl.checkedAt).toLocaleDateString() : 'Pending'}
            </p>
          </div>

        </div>

        {/* Incidents Section */}
        {incidents && incidents.length > 0 && (
          <div className="mt-8 bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="font-semibold text-xl tracking-tight mb-6 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              Incident History
            </h3>
            <div className="space-y-3">
              {incidents.map((incident: any) => (
                <div
                  key={incident.id}
                  className={cn(
                    "p-4 rounded-xl border",
                    incident.resolvedAt 
                      ? "bg-emerald-50 border-emerald-100" 
                      : "bg-red-50 border-red-100"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {incident.resolvedAt ? "Resolved" : "Ongoing"}
                      </p>
                      {incident.cause && (
                        <p className="text-sm text-black/60 mt-1">{incident.cause}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-black/50">
                      <p>Started: {new Date(incident.startedAt).toLocaleString()}</p>
                      {incident.resolvedAt && (
                        <p>Resolved: {new Date(incident.resolvedAt).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10">
        <p className="text-white/60 text-xs font-bold mb-1">{label}</p>
        <p className="text-lg font-semibold tracking-tight">
          {Math.round(payload[0].value)} <span className="text-sm font-medium text-white/50">ms</span>
        </p>
      </div>
    );
  }
  return null;
};