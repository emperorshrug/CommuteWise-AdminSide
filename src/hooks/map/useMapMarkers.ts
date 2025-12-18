import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Stop } from "../../types";

export const useMapMarkers = (
  map: mapboxgl.Map | null,
  markers: Stop[],
  tempMarker: { lat: number; lng: number } | null,
  onMarkerClick: (marker: Stop) => void
) => {
  const markerRefs = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const tempMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // PREVENT STALE CLOSURE
  const onMarkerClickRef = useRef(onMarkerClick);
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  // --- MANAGE SAVED MARKERS ---
  useEffect(() => {
    if (!map) return;

    const currentIds = new Set(Object.keys(markerRefs.current));
    const newMarkersMap = new Map(markers.map((m) => [m.id, m]));

    // 1. REMOVE DELETED MARKERS
    currentIds.forEach((id) => {
      if (!newMarkersMap.has(id)) {
        markerRefs.current[id].remove();
        delete markerRefs.current[id];
      }
    });

    // 2. ADD OR UPDATE MARKERS
    markers.forEach((marker) => {
      // Validate Coords
      if (typeof marker.lat !== "number" || typeof marker.lng !== "number")
        return;

      // Update existing if moved
      if (markerRefs.current[marker.id]) {
        const existing = markerRefs.current[marker.id];
        const pos = existing.getLngLat();
        if (pos.lat !== marker.lat || pos.lng !== marker.lng) {
          existing.setLngLat([marker.lng, marker.lat]);
        }
        return;
      }

      // Create New
      const color = marker.type === "terminal" ? "#ef4444" : "#0ea5e9";
      const el = document.createElement("div");
      el.className =
        "w-5 h-5 rounded-full cursor-pointer border-2 border-white shadow-md transition-transform hover:scale-125 hover:z-50";
      el.style.backgroundColor = color;

      const newMapboxMarker = new mapboxgl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onMarkerClickRef.current(marker);
      });

      markerRefs.current[marker.id] = newMapboxMarker;
    });
  }, [map, markers]);

  // --- MANAGE TEMP (GHOST) MARKER ---
  useEffect(() => {
    if (!map) return;

    if (tempMarkerRef.current) {
      tempMarkerRef.current.remove();
      tempMarkerRef.current = null;
    }

    if (tempMarker) {
      const el = document.createElement("div");
      el.className =
        "w-6 h-6 rounded-full border-2 border-dashed border-emerald-600 bg-emerald-500/20 animate-spin-slow pointer-events-none";

      tempMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([tempMarker.lng, tempMarker.lat])
        .addTo(map);
    }
  }, [map, tempMarker]);
};
