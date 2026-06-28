import React from "react";
import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Dashboard - CRO-Brain",
  description: "Automated Conversion Rate Optimization and Site Checkup Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Sticky Top Header Banner */}
        <Navbar />

        {/* Scrollable main content panel */}
        <main className="flex-1 overflow-y-auto bg-slate-900/40 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
