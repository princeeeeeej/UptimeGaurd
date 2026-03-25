import React from "react";
import MonitorCard from "./MonitorCard";

interface MonitorsGridProps {
  monitors: any[] | undefined;
  onToggle: (id: string, currentlyActive: boolean) => void;
  onDelete: (id: string, name: string) => void;
  onAddFirst: () => void;
}

export default function MonitorsGrid({
  monitors,
  onToggle,
  onDelete,
  onAddFirst,
}: MonitorsGridProps) {
  if (!monitors || monitors.length === 0) {
    return <EmptyState onAdd={onAddFirst} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {monitors.map((monitor: any) => (
        <MonitorCard
          key={monitor.id}
          monitor={monitor}
          onToggle={() => onToggle(monitor.id, monitor.isActive)}
          onDelete={() => onDelete(monitor.id, monitor.name)}
        />
      ))}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="col-span-2 text-center py-20 bg-white rounded-[2rem] border border-black/5">
      <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-6">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-black/30"
        >
          <path d="M12 2v20M2 12h20" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">No monitors yet</h3>
      <p className="text-black/50 mb-6 max-w-sm mx-auto">
        Start monitoring your websites, APIs and servers by adding your first
        monitor.
      </p>
      <button
        onClick={onAdd}
        className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
      >
        Add your first monitor
      </button>
    </div>
  );
}