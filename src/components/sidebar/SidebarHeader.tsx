import React from "react";
import { ChevronLeft } from "lucide-react";

interface SidebarHeaderProps {
  onClose?: () => void;
}

export default function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
      <div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          Route Manager
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          Manage Stops & Terminals
        </p>
      </div>

      {/* COLLAPSE BUTTON */}
      {onClose && (
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          title="Collapse Sidebar"
        >
          <ChevronLeft size={20} />
        </button>
      )}
    </div>
  );
}
