import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// [FIX] Updated type to 'HTMLDivElement | null' to match React's useRef
export const useMapbox = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  onMapClick: (lat: number, lng: number) => void
) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // PREVENT STALE CLOSURE
  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    if (map.current || !containerRef.current) return;

    map.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [121.0423, 14.676],
      zoom: 13,
    });

    map.current.on("load", () => setIsMapReady(true));
    map.current.on("click", (e) => {
      onMapClickRef.current(e.lngLat.lat, e.lngLat.lng);
    });

    const resizeObserver = new ResizeObserver(() => {
      map.current?.resize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.current?.remove();
    };
  }, [containerRef]);

  return { map, isMapReady };
};
