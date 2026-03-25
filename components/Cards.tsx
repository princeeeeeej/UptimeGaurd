// components/Cards.tsx
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  feature: string;
  icon?: LucideIcon;
  color?: "emerald" | "blue" | "amber" | "purple" | "red" | "cyan";
}

const colorClasses = {
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600" },
  blue: { bg: "bg-blue-50", icon: "text-blue-600" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600" },
  red: { bg: "bg-red-50", icon: "text-red-600" },
  cyan: { bg: "bg-cyan-50", icon: "text-cyan-600" },
};

export function Cards({ title, feature, icon: Icon, color = "emerald" }: CardProps) {
  const colors = colorClasses[color];

  return (
    <div className={cn(
      "group bg-white p-8 rounded-[2rem] border border-black/5",
      "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
      "hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]",
      "transition-all duration-300"
    )}>
      {/* Icon */}
      {Icon && (
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
          colors.bg
        )}>
          <Icon size={22} className={colors.icon} />
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold tracking-tight mb-3">{title}</h3>

      {/* Feature Description */}
      <p className="text-black/50 font-medium leading-relaxed">{feature}</p>
    </div>
  );
}