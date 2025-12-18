import React, { useEffect, useState } from "react";
import RouteManagerSidebar from "../components/RouteManagerSidebar";
import { RouteManagerMap } from "../components/RouteManagerMap";
import { useRouteStore } from "../store/useRouteStore";
import { ChevronRight } from "lucide-react";

export const RouteManager: React.FC = () => {
  const { fetchMarkers, isLoading } = useRouteStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* LAYER 0: MAP (The Background) */}
      <div className="absolute inset-0 z-0">
        <RouteManagerMap />
      </div>

      {/* LAYER 1: SIDEBAR (Floating Overlay) */}
      {/* 'left-20' (80px) positions it right after the collapsed Global Sidebar */}
      <div
        className={`absolute top-0 h-full z-40 transition-transform duration-300 ease-in-out left-20 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <RouteManagerSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* LAYER 2: EXPAND BUTTON (Visible when sidebar is closed) */}
      {!isSidebarOpen && (
        <div className="absolute top-4 left-24 z-30 animate-in fade-in zoom-in">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-white p-2 pr-3 rounded-r-xl shadow-lg border border-slate-200 text-slate-600 hover:text-emerald-600 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <ChevronRight size={20} />
            <span className="hidden sm:inline">Route Manager</span>
          </button>
        </div>
      )}

      {/* LAYER 3: GLOBAL LOADING INDICATOR (Top Right) */}
      {isLoading && (
        <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg z-50 font-bold text-emerald-600 flex items-center gap-2 border border-emerald-100">
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </div>
      )}
    </div>
  );
};

export default RouteManager;
