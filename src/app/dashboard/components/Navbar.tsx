"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { navigationItems } from "./Sidebar";
import { Terminal } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Find matching nav item or default to "Dashboard"
  const currentItem = navigationItems.find((item) => item.href === pathname);
  const currentTitle = currentItem ? currentItem.name : "Dashboard";

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between px-6 md:px-8">
      {/* Current Sub-section Title */}
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold text-slate-100 tracking-wide font-sans">
          {currentTitle}
        </h1>
      </div>

      {/* Dev Mode Status Indicator */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
          <Terminal className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400" />
          <span className="font-mono text-[10px] tracking-wide">
            Dev Mode: Supabase RLS Active
          </span>
        </div>
      </div>
    </header>
  );
}
