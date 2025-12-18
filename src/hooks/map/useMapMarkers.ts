import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Stop } from "../../types";
import { getMarkerStyle } from "../../utils/markerUtils";

export const useMapMarkers = (
  map: mapboxgl.Map | null,
  markers: Stop[],
  tempMarker: { lat: number; lng: number } | null,
  onMarkerClick: (marker: Stop) => void
) => {
  const markerRefs = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const tempMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const onMarkerClickRef = useRef(onMarkerClick);

  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  useEffect(() => {
    if (!map) return;

    const currentIds = new Set(Object.keys(markerRefs.current));
    const newMarkersMap = new Map(markers.map((m) => [m.id, m]));

    // REMOVE
    currentIds.forEach((id) => {
      if (!newMarkersMap.has(id)) {
        markerRefs.current[id].remove();
        delete markerRefs.current[id];
      }
    });

    // ADD / UPDATE
    markers.forEach((marker) => {
      if (typeof marker.lat !== "number" || typeof marker.lng !== "number")
        return;

      // Check if existing
      if (markerRefs.current[marker.id]) {
        const existing = markerRefs.current[marker.id];
        const pos = existing.getLngLat();
        if (pos.lat !== marker.lat || pos.lng !== marker.lng) {
          existing.setLngLat([marker.lng, marker.lat]);
        }
        return;
      }

      // [RESTORED FEATURE] APPLY COLOR & ICON LOGIC
      const { color, icon } = getMarkerStyle(marker.vehicleTypes);

      const el = document.createElement("div");
      el.className =
        "flex items-center justify-center cursor-pointer transition-transform hover:scale-125 hover:z-50";

      // Marker Shape (Pin)
      el.innerHTML = `
        <div style="background-color: ${color}" class="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-sm">
          ${icon}
        </div>
      `;

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

  // TEMP MARKER LOGIC
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
