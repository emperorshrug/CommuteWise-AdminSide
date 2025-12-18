// src/services/routeService.ts

/**
 * CONTEXT: CommuteWise Route Logic
 * * This service handles:
 * 1. Generating the polyline (GeoJSON) between stops using shortest-path logic (Mapbox Directions).
 * 2. Defining color logic for specific vehicle types (Tricycle vs Mixed).
 */

// Define the shape of a Stop object based on your DB schema
interface Stop {
  id: string | number;
  latitude: number;
  longitude: number;
}

interface RouteCalculationResult {
  // Use a generic object or specific GeoJSON type if available
  geometry: { type: string; coordinates: number[][] };
  distance: number;
  duration: number;
}

/**
 * CALCULATE BEST PATH (DIJKSTRA IMPLEMENTATION via API)
 * * We use the Mapbox Directions API as our routing engine.
 * It calculates the shortest path along the road network (Dijkstra/A*).
 * * @param stops - Array of stop objects containing lat/long
 * @param profile - 'driving' is standard for public transport (snaps to roads)
 */
export async function calculateRoutePath(
  stops: Stop[],
  accessToken: string,
  profile: "driving" | "walking" = "driving"
): Promise<RouteCalculationResult | null> {
  if (!stops || stops.length < 2) {
    console.warn("CommuteWise: Need at least 2 stops to calculate a path.");
    return null;
  }

  // Format coordinates as "lng,lat;lng,lat"
  const coordinatesString = stops
    .map((stop) => `${stop.longitude},${stop.latitude}`)
    .join(";");

  // Request geometries=geojson to get the LineString for the map
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinatesString}?geometries=geojson&access_token=${accessToken}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch route");
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return null;
    }

    // The "Best Path" is always the first route returned by the API
    const bestRoute = data.routes[0];

    return {
      geometry: bestRoute.geometry,
      distance: bestRoute.distance,
      duration: bestRoute.duration,
    };
  } catch (error) {
    console.error("CommuteWise Route Error:", error);
    return null;
  }
}

/**
 * GET ROUTE COLOR
 * * Logic:
 * - Tricycle: Green (Specific constraint)
 * - Jeep/Mixed: Yellow (Specific constraint: "yellow if mixed")
 * - Default: Blue/Gray
 */
export function getRouteColor(vehicleType: string): string {
  const type = vehicleType.toLowerCase().trim();

  if (type === "tricycle") {
    return "#22c55e"; // Tailwind green-500
  }

  if (type === "mixed" || type === "jeep" || type === "jeepney") {
    return "#eab308"; // Tailwind yellow-500
  }

  // Fallback for others
  return "#64748b"; // Tailwind slate-500
}
