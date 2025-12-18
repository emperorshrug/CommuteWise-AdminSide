import React, { useRef } from "react";
import { useRouteStore } from "../store/useRouteStore";
import { useMapbox } from "../hooks/map/useMapbox";
import { useMapMarkers } from "../hooks/map/useMapMarkers";
import { useUserLocation } from "../hooks/map/useUserLocation";
import "mapbox-gl/dist/mapbox-gl.css";

export const RouteManagerMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  // [ZUSTAND] Consume state directly
  const { markers, tempMarker, handleMapClick, selectMarker } = useRouteStore();

  // 1. INITIALIZE MAP
  const { map } = useMapbox(mapContainer, handleMapClick);

  // 2. HANDLE MARKERS
  useMapMarkers(map.current, markers, tempMarker, selectMarker);

  // 3. HANDLE USER LOCATION
  useUserLocation(map.current);

  return <div ref={mapContainer} className="w-full h-full absolute inset-0" />;
};
