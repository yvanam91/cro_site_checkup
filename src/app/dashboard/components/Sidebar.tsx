"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Database, 
  Compass, 
  Settings, 
  Brain,
  MoreVertical
} from "lucide-react";

export interface NavItem {
  readonly name: string;
  readonly href: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

export const navigationItems: readonly NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Audit Engine",
    href: "/dashboard/audit",
    icon: ShieldCheck,
  },
  {
    name: "Insight Repository",
    href: "/dashboard/insights",
    icon: Database,
  },
  {
    name: "CRO Framework",
    href: "/dashboard/framework",
    icon: Compass,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-slate-950 border-r border-slate-800/60 flex flex-col justify-between flex-shrink-0 text-slate-300">
      {/* Top Branding Section */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/40 gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
            <Brain className="w-5 h-5 text-white flex-shrink-0" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-wider text-sm font-sans uppercase">
              CRO-Brain
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Automated Optimization
            </span>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-slate-800/40">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {/* Avatar Placeholder */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600/30 text-xs font-semibold text-slate-200 shadow-inner">
              JD
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950" />
            </div>
            {/* User Info */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">
                Jane Doe
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                CRO Lead
              </span>
            </div>
          </div>
          <button 
            type="button"
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all duration-200"
            aria-label="Profile actions"
          >
            <MoreVertical className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
}
