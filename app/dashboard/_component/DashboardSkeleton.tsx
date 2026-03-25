import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F4EAE6] text-black font-sans pb-20">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="h-6 w-36 bg-black/10 rounded-full animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="h-10 w-36 bg-black/10 rounded-full animate-pulse" />
          <div className="h-8 w-8 bg-black/10 rounded-full animate-pulse" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 mt-12">
        {/* Header */}
        <div className="mb-16">
          <div className="h-12 w-96 bg-black/10 rounded-2xl animate-pulse mb-3" />
          <div className="h-8 w-72 bg-black/10 rounded-2xl animate-pulse mb-3" />
          <div className="h-5 w-80 bg-black/10 rounded-full animate-pulse" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[2rem] border border-black/5 h-28 animate-pulse"
            >
              <div className="h-4 w-24 bg-black/5 rounded mb-4" />
              <div className="h-10 w-16 bg-black/5 rounded" />
            </div>
          ))}
        </div>

        {/* Monitor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[2rem] border border-black/5 h-64 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-black/10" />
                <div className="h-5 w-32 bg-black/5 rounded" />
              </div>
              <div className="h-4 w-48 bg-black/5 rounded ml-6 mb-8" />
              <div className="flex justify-between mb-4">
                <div>
                  <div className="h-3 w-12 bg-black/5 rounded mb-2" />
                  <div className="h-4 w-20 bg-black/5 rounded" />
                </div>
                <div>
                  <div className="h-6 w-16 bg-black/5 rounded mb-1" />
                  <div className="h-3 w-16 bg-black/5 rounded" />
                </div>
              </div>
              <div className="h-8 bg-black/5 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}