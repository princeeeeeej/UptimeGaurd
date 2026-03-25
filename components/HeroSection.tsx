// components/HeroSection.tsx
import { SignUpButton } from "@clerk/nextjs";
import { Activity, ArrowRight, Zap, Shield, Bell } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-[#F4EAE6] text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-medium tracking-tight flex items-center gap-2">
          <Activity size={22} strokeWidth={2.5} />
          UptimeGuard
        </Link>
        <SignUpButton forceRedirectUrl="/dashboard">
          <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors">
            Login
          </button>
        </SignUpButton>
      </nav>

      {/* Hero Content */}
      <main className="max-w-7xl mx-auto px-8 pt-20 md:pt-32 pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-black/70">99.9% Uptime Monitoring</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter mb-6 leading-[0.95]">
            <span className="text-black/30">Stop Waking Up</span>
            <br />
            To Dead Websites
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-black/50 max-w-xl mb-10 font-medium">
            Monitor your websites, APIs and servers 24/7. 
            Instant alerts when something goes down. No surprises.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <SignUpButton forceRedirectUrl="/dashboard">
              <button className="bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-neutral-800 transition-all hover:scale-105 flex items-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                Start Monitoring <ArrowRight size={18} />
              </button>
            </SignUpButton>
            <Link 
              href="#features" 
              className="px-8 py-4 rounded-full text-base font-medium border border-black/10 hover:bg-black/5 transition-colors"
            >
              See Features
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-20 pt-10 border-t border-black/10">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-semibold tracking-tight">99.9%</p>
              <p className="text-sm text-black/50 font-medium mt-1">Uptime SLA</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-semibold tracking-tight">&lt;1s</p>
              <p className="text-sm text-black/50 font-medium mt-1">Alert Speed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-semibold tracking-tight">24/7</p>
              <p className="text-sm text-black/50 font-medium mt-1">Monitoring</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-semibold tracking-tight">Free</p>
              <p className="text-sm text-black/50 font-medium mt-1">To Start</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <div className=" bg-[#F4EAE6]/80 backdrop-blur-sm border-t border-black/5">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center text-sm text-black/40 font-medium">
          <p className="hidden sm:block">Your website works while you sleep.</p>
          <p>99.9% Uptime Starts Here. Sleep Well Tonight.</p>
        </div>
      </div>
    </div>
  );
}