import React, { useEffect } from "react";
import RouteManagerSidebar from "../components/RouteManagerSidebar";
import { RouteManagerMap } from "../components/RouteManagerMap";
import { useRouteStore } from "../store/useRouteStore";

export const RouteManager: React.FC = () => {
  const { fetchMarkers, isLoading } = useRouteStore();

  // Initial Fetch
  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  return (
    <div className="flex h-full w-full relative">
      {/* SIDEBAR */}
      <RouteManagerSidebar />

      {/* MAP */}
      <div className="flex-1 relative">
        <RouteManagerMap />

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg z-50 font-bold text-emerald-600 flex items-center gap-2 border border-emerald-100">
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteManager;
