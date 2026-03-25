import React from "react";

export default function MonitorDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F4EAE6] text-black font-sans pb-20">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="h-5 w-40 bg-black/10 rounded-full animate-pulse" />
        <div className="h-9 w-28 bg-black/10 rounded-full animate-pulse" />
      </nav>

      <main className="max-w-7xl mx-auto px-8 mt-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="h-6 w-24 bg-black/10 rounded-full animate-pulse mb-4" />
            <div className="h-14 w-72 bg-black/10 rounded-2xl animate-pulse mb-2" />
            <div className="h-5 w-48 bg-black/10 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-8">
            <div>
              <div className="h-4 w-24 bg-black/10 rounded animate-pulse mb-2" />
              <div className="h-8 w-20 bg-black/10 rounded animate-pulse" />
            </div>
            <div>
              <div className="h-4 w-16 bg-black/10 rounded animate-pulse mb-2" />
              <div className="h-8 w-20 bg-black/10 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-[1.5rem] border border-black/5 h-28 animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-black/5 mb-3" />
              <div className="h-3 w-16 bg-black/5 rounded mb-2" />
              <div className="h-6 w-12 bg-black/5 rounded" />
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 h-[400px] animate-pulse">
          <div className="flex justify-between mb-8">
            <div className="h-6 w-48 bg-black/5 rounded" />
            <div className="h-6 w-28 bg-black/5 rounded-full" />
          </div>
          <div className="h-[280px] bg-black/5 rounded-2xl" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-black/5 h-80 animate-pulse" />
          <div className="bg-black p-8 rounded-[2.5rem] h-80 animate-pulse" />
        </div>
      </main>
    </div>
  );
}