// src/services/routePersistenceService.ts

/**
 * CONTEXT: COMMUTEWISE ROUTE PERSISTENCE LAYER
 * ============================================
 * THIS MODULE HANDLES WRITING ROUTE DEFINITIONS INTO SUPABASE.
 *
 * CURRENT DB SCHEMA (public.routes):
 * ----------------------------------
 *  id             uuid PK
 *  created_at     timestamptz
 *  name           text
 *  vehicle_type   text
 *  origin_id      uuid (FK -> stops.id)
 *  destination_id uuid (FK -> stops.id)
 *
 * NOTE:
 * - FARE, STRICT/FREE FLAGS, DETAILED GEOMETRY, AND PER-SEGMENT COSTS ARE
 *   NOT YET PART OF THIS TABLE. THEY CAN BE ADDED LATER VIA:
 *   * EXTRA COLUMNS ON routes
 *   * OR A SEPARATE route_segments / route_stops TABLE.
 */

import { createClient } from "@supabase/supabase-js";

// CAPS LOCK COMMENT: UN-TYPED SUPABASE CLIENT JUST FOR ROUTES TABLE
// CAPS LOCK COMMENT: THIS AVOIDS TS ERRORS WHEN YOUR AUTO-GENERATED Database TYPE ONLY INCLUDES 'stops'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// CAPS LOCK COMMENT: MINIMAL TYPE FOR A ROW IN public.routes
export interface RouteRow {
  id: string;
  created_at: string;
  name: string;
  vehicle_type: string;
  origin_id: string | null;
  destination_id: string | null;
}

export interface RouteSavePayload {
  name: string;
  vehicleType: string;
  originId: string;
  destinationId: string;
}

/**
 * SAVE ROUTE DEFINITION TO SUPABASE
 * =================================
 * PERSISTS THE HIGH-LEVEL EDGE: ORIGIN STOP -> DESTINATION STOP WITH A NAME
 * AND VEHICLE TYPE. THIS IS THE EDGE YOUR CLIENT-SIDE DIJKSTRA ROUTER WILL
 * EVENTUALLY USE WHEN BUILDING A TRANSPORT GRAPH.
 */
export async function saveRouteDefinition(
  payload: RouteSavePayload
): Promise<RouteRow> {
  const { name, vehicleType, originId, destinationId } = payload;

  const { data, error } = await supabase
    // CAPS LOCK COMMENT: NO GENERIC TYPE ARGUMENTS HERE -> AVOIDS "EXPECTED 2 TYPE ARGUMENTS" ERROR
    .from("routes")
    .insert({
      name,
      vehicle_type: vehicleType.toLowerCase(), // NORMALIZE FOR CONSISTENCY
      origin_id: originId,
      destination_id: destinationId,
    })
    .select("*")
    .single();

  if (error) {
    console.error("COMMUTEWISE: FAILED TO SAVE ROUTE DEFINITION:", error);
    throw error;
  }

  // CAPS LOCK COMMENT: CAST TO ROUTEROW SO CALL SITES HAVE STRONG TYPES WITHOUT TIGHT COUPLING TO AUTO-GEN Database TYPE
  return data as RouteRow;
}
