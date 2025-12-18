import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

export const useUserLocation = (map: mapboxgl.Map | null) => {
  const userLocationMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    const addUserMarker = (lat: number, lng: number) => {
      if (!map || !map.getCanvasContainer()) return;
      if (userLocationMarkerRef.current) return;

      try {
        const el = document.createElement("div");

        // GOOGLE MAPS STYLE BLUE DOT
        // Fixed size (w-5 h-5), White Border, Blue Fill, Blue Glow Shadow
        el.className =
          "w-5 h-5 bg-blue-500 rounded-full border-[3px] border-white shadow-[0_0_10px_rgba(59,130,246,0.6)] relative z-20";

        // PULSE ANIMATION (Using pseudo-element logic via specific class or simple inner div)
        // We use a simple inner div that scales up and fades out
        const pulse = document.createElement("div");
        pulse.className =
          "absolute -inset-4 bg-blue-500/40 rounded-full animate-ping opacity-75 pointer-events-none";

        el.appendChild(pulse);

        userLocationMarkerRef.current = new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);
      } catch (error) {
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
