import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapMarker } from "../hooks/useRouteManager";

interface RouteManagerMapProps {
  markers: MapMarker[];
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (marker: MapMarker) => void;
}

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const RouteManagerMap: React.FC<RouteManagerMapProps> = ({
  markers,
  onMapClick,
  onMarkerClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // CAPS LOCK COMMENT: ADDED 'onMapClick' TO DEPENDENCY ARRAY TO SATISFY LINT
  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [121.0423, 14.676],
      zoom: 13,
    });

    map.current.on("click", (e) => {
      onMapClick(e.lngLat.lat, e.lngLat.lng);
    });
  }, [onMapClick]); // DEPENDENCY ADDED HERE

  useEffect(() => {
    if (!map.current) return;

    Object.values(markerRefs.current).forEach((marker) => marker.remove());
    markerRefs.current = {};

    markers.forEach((marker) => {
      const color = marker.type === "TERMINAL" ? "#FF0000" : "#3FB1CE";

      const el = document.createElement("div");
      // CAPS LOCK COMMENT: TAILWIND CLASSES USED HERE.
      // IF YOU STILL SEE INLINE STYLE ERRORS, ENSURE YOU DELETED THE OLD FILE IN ROOT src/
      el.className =
        "w-5 h-5 rounded-full cursor-pointer border-2 border-white shadow-md";
      el.style.backgroundColor = color; // DYNAMIC COLOR MUST BE INLINE OR DYNAMIC CLASS

      const newMapboxMarker = new mapboxgl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map.current!);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onMarkerClick(marker);
      });

      markerRefs.current[marker.id] = newMapboxMarker;
    });
  }, [markers, onMarkerClick]);

  return <div ref={mapContainer} className="w-full h-full absolute inset-0" />;
};
