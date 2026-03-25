// components/WhySection.tsx
import { 
  Brain, 
  Stethoscope, 
  BellRing, 
  ShieldCheck, 
  Zap, 
  BarChart3,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Brain,
    title: "Predict",
    description: "Know 10 minutes before your site crashes with AI-powered anomaly detection.",
    color: "emerald",
  },
  {
    icon: Stethoscope,
    title: "Diagnose",
    description: "Automatic root cause analysis when things break. No more guessing games.",
    color: "blue",
  },
  {
    icon: BellRing,
    title: "Smart Alerts",
    description: "85% fewer notifications with intelligent alert grouping and deduplication.",
    color: "amber",
  },
  {
    icon: ShieldCheck,
    title: "SSL Monitoring",
    description: "Know when certificates expire before your users see scary warnings.",
    color: "purple",
  },
  {
    icon: Zap,
    title: "Redis Powered",
    description: "Sub-second caching for lightning-fast dashboard and real-time updates.",
    color: "red",
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    description: "Live charts, uptime tracking, and response time monitoring at a glance.",
    color: "cyan",
  },
];

const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
  emerald: { 
    bg: "bg-emerald-50", 
    icon: "text-emerald-600", 
    border: "group-hover:border-emerald-200" 
  },
  blue: { 
    bg: "bg-blue-50", 
    icon: "text-blue-600", 
    border: "group-hover:border-blue-200" 
  },
  amber: { 
    bg: "bg-amber-50", 
    icon: "text-amber-600", 
    border: "group-hover:border-amber-200" 
  },
  purple: { 
    bg: "bg-purple-50", 
    icon: "text-purple-600", 
    border: "group-hover:border-purple-200" 
  },
  red: { 
    bg: "bg-red-50", 
    icon: "text-red-600", 
    border: "group-hover:border-red-200" 
  },
  cyan: { 
    bg: "bg-cyan-50", 
    icon: "text-cyan-600", 
    border: "group-hover:border-cyan-200" 
  },
};

export default function WhySection() {
  return (
    <section id="features" className="bg-[#F4EAE6] text-black font-sans py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 mb-6">
            <Zap size={14} className="text-black/60" />
            <span className="text-sm font-medium text-black/70">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-4">
            <span className="text-black/30">Why Choose</span>
            <br />
            UptimeGuard
          </h2>
          <p className="text-lg text-black/50 max-w-xl mx-auto font-medium">
            Everything you need to keep your services running smoothly, all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 md:mt-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-4 rounded-full border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <span className="text-black/60 font-medium">Ready to get started?</span>
            <a 
              href="/dashboard" 
              className="text-black font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              Try it free <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  color: string;
}) {
  const colors = colorClasses[color];

  return (
    <div className={cn(
      "group bg-white p-8 rounded-[2rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
      "hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300",
      colors.border
    )}>
      {/* Icon */}
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
        colors.bg
      )}>
        <Icon size={24} className={colors.icon} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold tracking-tight mb-3">{title}</h3>

      {/* Description */}
      <p className="text-black/50 font-medium leading-relaxed">{description}</p>

      {/* Hover Arrow */}
      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm font-medium text-black/40 flex items-center gap-1">
          Learn more <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}