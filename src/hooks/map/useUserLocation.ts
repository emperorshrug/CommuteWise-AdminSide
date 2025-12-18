import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

export const useUserLocation = (map: mapboxgl.Map | null) => {
  const userLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    const addUserMarker = (lat: number, lng: number) => {
      // GUARD: Check if map is actually usable
      if (!map || !map.getCanvasContainer()) return;

      // Prevent Duplicate
      if (userLocationMarkerRef.current) return;

      try {
        const el = document.createElement("div");
        el.className =
          "w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative z-0";

        const pulse = document.createElement("div");
        pulse.className =
          "absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75";
        el.appendChild(pulse);

        userLocationMarkerRef.current = new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);
      } catch (error) {
        // [FIX] We now 'use' the error variable by logging it.
        // This solves the 'no-unused-vars' lint error.
        console.warn("Could not add user location marker:", error);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          addUserMarker(position.coords.latitude, position.coords.longitude);
        },
        (err) => console.warn("Location access denied:", err),
        { enableHighAccuracy: true }
      );
    }
  }, [map]);
};
