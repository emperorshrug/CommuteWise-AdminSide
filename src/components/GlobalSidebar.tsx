import React, { useState } from "react";
import { Map, LayoutDashboard, Settings, LogOut } from "lucide-react";

export default function GlobalSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`h-screen bg-white text-slate-600 flex flex-col z-50 border-r border-slate-200 shadow-xl transition-[width] duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* --- HEADER (CLICK TO TOGGLE) --- */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-16 flex items-center px-4 border-b border-slate-100 shrink-0 cursor-pointer hover:bg-slate-50 transition-colors gap-4"
        title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {/* LOGO */}
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20 shrink-0">
          CW
        </div>

        {/* TITLE */}
        <span
          className={`font-bold text-xl text-slate-800 tracking-tight whitespace-nowrap transition-all duration-300 ${
            isExpanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-4 pointer-events-none w-0 overflow-hidden"
          }`}
        >
          CommuteWise
        </span>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto overflow-x-hidden">
        <SidebarItem
          icon={<LayoutDashboard size={22} />}
          label="Dashboard"
          expanded={isExpanded}
          active={false}
        />
        <SidebarItem
          icon={<Map size={22} />}
          label="Route Manager"
          expanded={isExpanded}
          active={true}
        />
        <SidebarItem
          icon={<Settings size={22} />}
          label="Settings"
          expanded={isExpanded}
          active={false}
        />
      </nav>

      {/* --- FOOTER --- */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <SidebarItem
          icon={<LogOut size={22} />}
          label="Logout"
          expanded={isExpanded}
          active={false}
          variant="danger"
        />
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  active: boolean;
  variant?: "default" | "danger";
}

function SidebarItem({
  icon,
  label,
  expanded,
  active,
  variant = "default",
}: SidebarItemProps) {
  const baseClass =
    "flex items-center gap-4 px-3 py-3 rounded-xl transition-all cursor-pointer group relative";

  const activeClass = active
    ? "bg-emerald-50 text-emerald-600 font-semibold ring-1 ring-emerald-500/20"
    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800";

  const dangerClass = "text-red-400 hover:bg-red-50 hover:text-red-500";

  return (
    <div
      className={`${baseClass} ${
        variant === "danger" ? dangerClass : activeClass
      }`}
    >
      <div className="shrink-0">{icon}</div>

      <span
        className={`whitespace-nowrap font-medium transition-all duration-300 ${
          expanded
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-4 w-0 overflow-hidden"
        }`}
      >
        {label}
      </span>

      {!expanded && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-slate-800 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl transition-opacity">
          {label}
        </div>
      )}
    </div>
  );
}
