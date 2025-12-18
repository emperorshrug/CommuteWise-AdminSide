import React, { useRef } from "react";
import { useRouteStore } from "../store/useRouteStore";
import { useRouteBuilderStore } from "../store/useRouteBuilderStore";
import { useMapbox } from "../hooks/map/useMapbox";
import { useMapMarkers } from "../hooks/map/useMapMarkers";
import { useUserLocation } from "../hooks/map/useUserLocation";
import { Crosshair } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Stop } from "../types";

export const RouteManagerMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  const { markers, tempMarker, handleMapClick, selectMarker } = useRouteStore();
  const {
    isSelectingOnMap,
    activePointIndex,
    confirmMapSelection,
    cancelMapSelection,
  } = useRouteBuilderStore();

  const onMapClickWrapper = (lat: number, lng: number) => {
    // CAPS LOCK COMMENT: ALWAYS UPDATE ROUTE STORE MARKER LOGIC
    handleMapClick(lat, lng);
  };

  const onMarkerClickWrapper = (marker: Stop) => {
    if (isSelectingOnMap) {
      // CAPS LOCK COMMENT: WHEN IN MAP SELECTION MODE, CLICKING AN EXISTING STOP
      // CAPS LOCK COMMENT: DIRECTLY UPDATES THE ACTIVE ROUTE POINT (NO STOP FORM)
      confirmMapSelection(marker);
    } else {
      // CAPS LOCK COMMENT: NORMAL MODE = OPEN STOP FORM FOR EDITING
      selectMarker(marker);
    }
  };

  const { map } = useMapbox(mapContainer, onMapClickWrapper);

  useMapMarkers(map.current, markers, tempMarker, onMarkerClickWrapper);
  useUserLocation(map.current);

  const handleRecenter = () => {
    if (!map.current) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          map.current?.flyTo({
            center: [pos.coords.longitude, pos.coords.latitude],
            zoom: 15,
          }),
        (err) => console.warn(err)
      );
    }
  };

  const selectionLabel = activePointIndex === 0 ? "Origin" : "Stop";

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full absolute inset-0" />

      {/* CAPS LOCK COMMENT: MAP SELECTION BANNER - UPDATED TO MATCH WHITE/EMERALD THEME */}
      {isSelectingOnMap && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 bg-white text-slate-900 px-6 py-3 rounded-full shadow-lg border border-emerald-200 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
          <span className="font-bold text-sm">
            Select {selectionLabel} Point
          </span>
          <button
            onClick={cancelMapSelection}
            className="text-emerald-600 hover:text-emerald-700 font-bold text-xs uppercase"
          >
            Cancel
          </button>
        </div>
      )}

      <button
        onClick={handleRecenter}
        className="absolute bottom-8 right-5 z-20 bg-white p-3 rounded-full shadow-lg border-2 border-slate-100 text-slate-600 hover:text-emerald-600 transition-all"
        title="Recenter Map to Your Location"
      >
        <Crosshair size={24} />
      </button>
    </div>
  );
};
