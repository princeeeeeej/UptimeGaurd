import React from "react";

export default function DashboardHeader() {
  return (
    <div className="mb-16">
      <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-4">
        <span className="text-black/40">Status Overview.</span>
        <br />
        Everything at a glance.
      </h2>
      <p className="text-black/60 font-medium">
        Monitors your websites, APIs and servers 24/7.
      </p>
    </div>
  );
}