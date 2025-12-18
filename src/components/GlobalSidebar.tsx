import React, { useState } from "react";
import { Map, LayoutDashboard, Settings, LogOut } from "lucide-react";

export default function GlobalSidebar() {
  const [isLocked, setIsLocked] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isLocked || isHovered;

  return (
    <div
      className={`h-screen bg-slate-900 text-white flex flex-col z-50 border-r border-slate-800 shadow-2xl transition-[width] duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-20"
      }`}
      onMouseEnter={() => !isLocked && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- HEADER --- */}
      <div className="h-20 flex items-center px-5 border-b border-slate-800 overflow-hidden shrink-0">
        <div className="flex items-center gap-3">
          {/* LOGO BOX (FIXED SIZE) */}
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20 shrink-0">
            CW
          </div>
          {/* TITLE (ABSOLUTE POSITION or OPACITY FADE to prevent layout shift) */}
          <span
            className={`font-bold text-xl tracking-tight whitespace-nowrap transition-all duration-300 ${
              isExpanded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4 pointer-events-none"
            }`}
          >
            CommuteWise
          </span>
        </div>
      </div>

      {/* --- TOGGLE SWITCH (FADE IN/OUT) --- */}
      <div
        className={`px-5 py-4 border-b border-slate-800/50 transition-all duration-300 overflow-hidden ${
          isExpanded ? "opacity-100 max-h-20" : "opacity-0 max-h-0 py-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Sidebar Lock
          </span>

          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
              isLocked ? "bg-emerald-500" : "bg-slate-600"
            }`}
            aria-label="Toggle Sidebar Lock"
          >
            <div
              className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-md transition-all duration-300 ${
                isLocked ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
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
      <div className="p-4 border-t border-slate-800 shrink-0">
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
    ? "bg-emerald-600/10 text-emerald-400 border border-emerald-600/20"
    : "text-slate-400 hover:bg-slate-800 hover:text-white";
  const dangerClass = "text-red-400 hover:bg-red-900/20 hover:text-red-300";

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
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-slate-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-slate-700 shadow-xl transition-opacity">
          {label}
        </div>
      )}
    </div>
  );
}
