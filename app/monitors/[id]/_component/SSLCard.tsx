import React from "react";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface SSLData {
  isValid: boolean;
  issuer: string | null;
  daysUntilExpiry: number;
  checkedAt: string;
  protocol: string | null;
}

interface SSLCardProps {
  ssl: SSLData | null;
}

export default function SSLCard({ ssl }: SSLCardProps) {
  const isExpired = ssl ? ssl.daysUntilExpiry <= 0 : false;
  const isWarning = ssl ? ssl.daysUntilExpiry < 14 : false;

  return (
    <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

      <div className="relative">
        {/* Header */}
        <h3 className="font-semibold text-xl tracking-tight mb-8 flex items-center gap-2">
          {ssl?.isValid ? (
            <ShieldCheck className="text-emerald-400" size={22} />
          ) : (
            <ShieldAlert className="text-red-400" size={22} />
          )}
          SSL Certificate
        </h3>

        {ssl ? (
          <div className="space-y-6">
            <SSLField
              label="Status"
              value={
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      ssl.isValid ? "bg-emerald-400" : "bg-red-400"
                    )}
                  />
                  {ssl.isValid ? "Valid" : "Invalid / Expired"}
                </span>
              }
            />

            <SSLField label="Issuer" value={ssl.issuer || "Unknown"} />

            {ssl.protocol && (
              <SSLField label="Protocol" value={ssl.protocol} />
            )}

            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                Expires In
              </p>
              <p
                className={cn(
                  "text-3xl font-semibold tracking-tight",
                  isExpired && "text-red-400",
                  isWarning && !isExpired && "text-amber-400"
                )}
              >
                {isExpired
                  ? "Expired"
                  : `${ssl.daysUntilExpiry} Days`}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-white/50 text-sm">
            SSL check runs periodically. Data will appear after the first
            check.
          </p>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-white/30 text-center font-medium relative">
        Checked:{" "}
        {ssl ? new Date(ssl.checkedAt).toLocaleDateString() : "Pending"}
      </p>
    </div>
  );
}

function SSLField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  );
}