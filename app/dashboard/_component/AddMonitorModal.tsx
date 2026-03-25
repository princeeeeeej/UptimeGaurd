"use client";

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface AddMonitorModalProps {
  onClose: () => void;
  onAdd: () => void;
}

export default function AddMonitorModal({
  onClose,
  onAdd,
}: AddMonitorModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus name input on mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanUrl = url.startsWith("http") ? url : `https://${url}`;

      const res = await fetch("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url: cleanUrl, interval: 60 }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create monitor");
      }

      onAdd();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-black/30 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Add Monitor
        </h2>
        <p className="text-black/50 text-sm mb-6">
          We'll start checking it every 60 seconds.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Name">
            <input
              ref={nameInputRef}
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production API"
              className="w-full bg-[#F4EAE6] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10 transition-all placeholder:text-black/30"
            />
          </FormField>

          <FormField label="URL">
            <input
              required
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="w-full bg-[#F4EAE6] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10 transition-all placeholder:text-black/30"
            />
          </FormField>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-black/5 text-black font-medium py-3 rounded-full hover:bg-black/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white font-medium py-3 rounded-full hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Monitor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-black/50 mb-2 block">
        {label}
      </label>
      {children}
    </div>
  );
}