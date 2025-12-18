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

    // REMOVE MARKERS THAT NO LONGER EXIST
    currentIds.forEach((id) => {
      if (!newMarkersMap.has(id)) {
        markerRefs.current[id].remove();
        delete markerRefs.current[id];
      }
    });

    // ADD / UPDATE MARKERS
    markers.forEach((marker) => {
      if (typeof marker.lat !== "number" || typeof marker.lng !== "number")
        return;

      // UPDATE EXISTING POSITION IF NEEDED
      if (markerRefs.current[marker.id]) {
        const existing = markerRefs.current[marker.id];
        const pos = existing.getLngLat();
        if (pos.lat !== marker.lat || pos.lng !== marker.lng) {
          existing.setLngLat([marker.lng, marker.lat]);
        }
        return;
      }

      // DETERMINE COLOR & ICON BASED ON VEHICLE TYPES
      const { color, icon } = getMarkerStyle(marker.vehicleTypes);

      const el = document.createElement("div");
      el.className =
        "flex items-center justify-center cursor-pointer transition-transform hover:scale-125 hover:z-50";

      // CAPS LOCK COMMENT: DIFFERENT VISUALS FOR STOP VS TERMINAL/OTHERS
      // - STOP: SMALL WHITE DOT WITH BLACK CIRCULAR BORDER (NO EMOJI).
      // - OTHERS: COLORED CIRCLE WITH BLACK BORDER + ICON.
      if (marker.type === "stop") {
        el.innerHTML = `
          <div class="w-3 h-3 rounded-full border border-black bg-white shadow-md"></div>
        `;
      } else {
        el.innerHTML = `
          <div style="background-color: ${color}" class="w-8 h-8 rounded-full border-2 border-black shadow-md flex items-center justify-center text-sm text-black">
            ${icon ?? ""}
          </div>
        `;
      }

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

  // TEMP MARKER (GHOST) LOGIC
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
