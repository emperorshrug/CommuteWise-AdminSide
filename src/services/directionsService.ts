// src/services/directionsService.ts

/**
 * CONTEXT: COMMUTEWISE MAPBOX / DIJKSTRA LAYER
 * ============================================
 * THIS MODULE HANDLES CALLS TO THE MAPBOX DIRECTIONS API.
 *
 * RESPONSIBILITIES:
 * 1) CALCULATE THE SHORTEST ROAD PATH BETWEEN ORDERED STOPS.
 *    - MAPBOX INTERNALLY USES DIJKSTRA / A* ON ITS ROAD GRAPH.
 * 2) PROVIDE SIMPLE COLOR MAPPING FOR VEHICLE TYPES.
 *
 * KEY BEHAVIOR:
 * - INPUT STOPS CAN BE SLIGHTLY OFF-ROAD (E.G. TERMINAL INSIDE MARKET).
 * - MAPBOX "SNAPS" THESE TO THE NEAREST ROAD POINT.
 * - WE USE AN OPTIONAL "SNAP RADIUS" TO CONTROL HOW FAR IT'S ALLOWED
 *   TO SEARCH FOR A NEARBY ROAD SEGMENT.
 */

export interface DirectionsStop {
  id: string | number;
  latitude: number;
  longitude: number;
}

export interface RouteCalculationResult {
  // GEOJSON LINESTRING
  geometry: { type: string; coordinates: number[][] };
  distance: number; // METERS
  duration: number; // SECONDS
}

/**
 * CALCULATE BEST PATH (DIJKSTRA/A* VIA MAPBOX DIRECTIONS)
 * =======================================================
 * @param stops      ORDERED LIST OF STOPS (ORIGIN -> ... WAYPOINTS ... -> DEST)
 * @param accessToken MAPBOX API TOKEN
 * @param profile     "driving" OR "walking"
 * @param snapRadiusMeters
 *   - MAX DISTANCE (M) TO SEARCH FOR A ROAD NEAR EACH INPUT POINT.
 *   - SMALLER VALUE = LESS LIKELY TO JUMP TO FAR-AWAY ROADS (MORE STABLE).
 *   - LARGER VALUE  = MORE FLEXIBLE WHEN ADMIN PLACES STOPS FAR FROM ROADS.
 */
export async function calculateRoutePath(
  stops: DirectionsStop[],
  accessToken: string,
  profile: "driving" | "walking" = "driving",
  snapRadiusMeters = 50
): Promise<RouteCalculationResult | null> {
  if (!stops || stops.length < 2) {
    console.warn("COMMUTEWISE: NEED AT LEAST 2 STOPS TO CALCULATE A PATH.");
    return null;
  }

  // FORMAT COORDINATES AS "lng,lat;lng,lat"
  const coordinatesString = stops
    .map((stop) => `${stop.longitude},${stop.latitude}`)
    .join(";");

  // CAPS LOCK COMMENT: RADIUSES PARAM CONTROLS HOW FAR MAPBOX CAN LOOK FOR A ROAD NEAR EACH POINT
  const radiuses = stops.map(() => snapRadiusMeters).join(";");

  // REQUEST:
  // - geometries=geojson -> WE WANT A GEOJSON LINESTRING
  // - overview=full      -> HIGH RES GEOMETRY (LESS JAGGY, MORE ACCURATE)
  // - radiuses           -> STABILITY CONTROL AROUND EACH STOP
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinatesString}?geometries=geojson&overview=full&radiuses=${radiuses}&access_token=${accessToken}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch route: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      console.warn("COMMUTEWISE: MAPBOX RETURNED NO ROUTES.");
      return null;
    }

    // CAPS LOCK COMMENT: BEST PATH = FIRST ROUTE RETURNED
    const bestRoute = data.routes[0];

    return {
      geometry: bestRoute.geometry,
      distance: bestRoute.distance,
      duration: bestRoute.duration,
    };
  } catch (error) {
    console.error("COMMUTEWISE ROUTE ERROR:", error);
    return null;
  }
}

/**
 * GET ROUTE COLOR
 * ===============
 * SIMPLE COLOR RULES BY VEHICLE TYPE.
 */
export function getRouteColor(vehicleType: string): string {
  const type = vehicleType.toLowerCase().trim();

  if (type === "tricycle") {
    return "#22c55e"; // TAILWIND GREEN-500
  }

  if (type === "mixed" || type === "jeep" || type === "jeepney") {
    return "#eab308"; // TAILWIND YELLOW-500
  }

  // FALLBACK FOR OTHERS
  return "#64748b"; // TAILWIND SLATE-500
}
