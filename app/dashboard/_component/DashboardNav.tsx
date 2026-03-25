import React from "react";
import { Plus, Activity } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface DashboardNavProps {
  onNewMonitor: () => void;
}

export default function DashboardNav({ onNewMonitor }: DashboardNavProps) {
  return (
    <nav className="sticky top-0 z-40 bg-[#F4EAE6]/80 backdrop-blur-md border-b border-black/5">
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-lg sm:text-xl font-medium tracking-tight flex items-center gap-2"
        >
          <Activity size={20} />
          <span>UptimeGuard</span>
        </Link>

        {/* Actions - Works on all screens */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile: Icon only | Desktop: Full button */}
          <button
            onClick={onNewMonitor}
            className="bg-black text-white rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-2 p-2.5 sm:px-6 sm:py-2.5"
          >
            <Plus size={16} />
            <span className="hidden sm:inline text-sm font-medium">
              New Monitor
            </span>
          </button>
          <UserButton />
        </div>
      </div>
    </nav>
  );
}