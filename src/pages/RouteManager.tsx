import React, { useEffect, useState } from "react";
import RouteManagerSidebar from "../components/RouteManagerSidebar";
import { RouteManagerMap } from "../components/RouteManagerMap";
import { useRouteStore } from "../store/useRouteStore";
import { ChevronRight } from "lucide-react";

// CAPS LOCK COMMENT: ROUTEMANAGER NEEDS TO KNOW CURRENT GLOBAL SIDEBAR WIDTH
// CAPS LOCK COMMENT: THIS LETS US POSITION THE ROUTE SIDEBAR DIRECTLY TO THE RIGHT OF IT
interface RouteManagerProps {
  globalSidebarWidth: number;
}

export const RouteManager: React.FC<RouteManagerProps> = ({
  globalSidebarWidth,
}) => {
  const { fetchMarkers, isLoading } = useRouteStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  // CAPS LOCK COMMENT: COMPUTE A SINGLE TRANSFORM VALUE THAT BOTH
  // CAPS LOCK COMMENT: 1) OFFSETS THE SIDEBAR BY THE GLOBAL SIDEBAR WIDTH
  // CAPS LOCK COMMENT: 2) HANDLES OPEN/CLOSE BY MOVING IT LEFT BY ITS OWN WIDTH (100%)
  // CAPS LOCK COMMENT: USING CALC() LETS US COMBINE PIXEL AND PERCENT UNITS WHILE STILL BEING ANIMATABLE
  const sidebarTransform = isSidebarOpen
    ? `translateX(${globalSidebarWidth}px)`
    : `translateX(calc(${globalSidebarWidth}px - 100%))`;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* LAYER 0: MAP (THE BACKGROUND, FULL SCREEN, UNAFFECTED BY SIDEBAR WIDTH CHANGES) */}
      <div className="absolute inset-0 z-0">
        <RouteManagerMap />
      </div>

      {/* LAYER 1: ROUTE MANAGER SIDEBAR */}
      {/* CAPS LOCK COMMENT: LEFT=0, BUT WE SHIFT IT HORIZONTALLY USING TRANSFORM SO IT FOLLOWS THE GLOBAL SIDEBAR SMOOTHLY */}
      {/* CAPS LOCK COMMENT: TRANSITION-TRANSFORM ENSURES BOTH OPEN/CLOSE AND GLOBAL SIDEBAR WIDTH CHANGES ANIMATE CLEANLY */}
      <div
        className="absolute top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out"
        style={{ transform: sidebarTransform }}
      >
        <RouteManagerSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* LAYER 2: EXPAND BUTTON (VISIBLE ONLY WHEN ROUTE SIDEBAR IS CLOSED) */}
      {!isSidebarOpen && (
        <div
          className="absolute top-4 z-30 animate-in fade-in zoom-in transition-[left] duration-300 ease-in-out"
          // CAPS LOCK COMMENT: PLACE THE BUTTON JUST TO THE RIGHT OF THE GLOBAL SIDEBAR WITH A SMALL GAP
          style={{ left: globalSidebarWidth + 16 }}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-white p-2 pr-3 rounded-r-xl shadow-lg border border-slate-200 text-slate-600 hover:text-emerald-600 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <ChevronRight size={20} />
            <span className="hidden sm:inline">Route Manager</span>
          </button>
        </div>
      )}

      {/* LAYER 3: GLOBAL LOADING INDICATOR (TOP RIGHT, FLOATING ABOVE MAP AND SIDE BARS) */}
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
