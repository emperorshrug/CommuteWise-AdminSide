import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

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

    // CREATE MAP ONLY ONCE
    map.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [121.0423, 14.676],
      zoom: 13,
      preserveDrawingBuffer: true, // Helps with flicker
    });

    map.current.on("load", () => {
      setIsMapReady(true);
      // Ensure resize triggers once loaded to fill container
      map.current?.resize();
    });

    map.current.on("click", (e) => {
      onMapClickRef.current(e.lngLat.lat, e.lngLat.lng);
    });

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(() => {
      // Only resize if map is actually ready
      if (map.current) map.current.resize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      // DO NOT REMOVE MAP HERE IN DEV MODE TO PREVENT FLASHING
      // map.current.remove();
      // map.current = null;
    };
  }, [containerRef]);

  return { map, isMapReady };
};
