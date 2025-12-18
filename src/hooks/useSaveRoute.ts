// src/hooks/useSaveRoute.ts

/**
 * CONTEXT: COMMUTEWISE ROUTE BUILDER SAVE HOOK
 * ============================================
 * THIS HOOK CONNECTS:
 * - ZUSTAND STORES (ROUTE BUILDER + ROUTE STORE)
 * - PURE DOMAIN LOGIC (routeBuilderService)
 * - EXTERNAL SERVICES (MAPBOX DIRECTIONS + SUPABASE ROUTES)
 *
 * IT EXPOSES A SIMPLE API TO THE UI:
 *   const { isSaving, saveRoute } = useSaveRoute();
 */

import { useState } from "react";
import { useRouteBuilderStore } from "../store/useRouteBuilderStore";
import { useRouteStore } from "../store/useRouteStore";
import {
  calculateRoutePath,
  saveRouteDefinition,
} from "../services/routeService";
import {
  validateRouteContext,
  resolveRouteStops,
  type BuildRouteContext,
} from "../services/routeBuilderService";

export function useSaveRoute() {
  const {
    routeName,
    transportMode,
    isFree,
    fare,
    isStrict,
    points,
    cancelBuilding,
  } = useRouteBuilderStore();

  const { markers } = useRouteStore();

  const [isSaving, setIsSaving] = useState(false);

  const saveRoute = async () => {
    if (isSaving) return;

    const ctx: BuildRouteContext = {
      routeName,
      transportMode,
      isFree,
      fare,
      isStrict,
      points,
      markers,
    };

    // CAPS LOCK COMMENT: RUN PURE VALIDATION FIRST SO WE CAN SHOW ALL ERRORS AT ONCE
    const errors = validateRouteContext(ctx);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!mapboxToken) {
      alert("Mapbox token is missing. Please configure VITE_MAPBOX_TOKEN.");
      return;
    }

    try {
      setIsSaving(true);

      // CAPS LOCK COMMENT: RESOLVE ORIGIN/DESTINATION/ORDERED STOPS
      const { origin, destination, orderedStops } = resolveRouteStops(ctx);

      // CAPS LOCK COMMENT: TRANSFORM STOPS -> DIRECTIONS STOPS FOR MAPBOX
      const directionsStops = orderedStops.map((s) => ({
        id: s.id,
        latitude: s.lat,
        longitude: s.lng,
      }));

      // CAPS LOCK COMMENT: SNAP RADIUS = 50M -> STABLE BUT FLEXIBLE AROUND TERMINALS
      const SNAP_RADIUS_METERS = 50;

      const routeResult = await calculateRoutePath(
        directionsStops,
        mapboxToken,
        "driving",
        SNAP_RADIUS_METERS
      );

      if (!routeResult) {
        alert("Unable to calculate route path. Please adjust the stops.");
        return;
      }

      // CAPS LOCK COMMENT: FOR NOW WE ONLY LOG THE GEOMETRY.
      // CAPS LOCK COMMENT: LATER WE WILL STORE PER-SEGMENT GEOMETRY / COSTS IN route_segments.
      console.log("COMMUTEWISE: CALCULATED ROUTE GEOMETRY", routeResult);

      // CAPS LOCK COMMENT: SAVE HIGH-LEVEL ROUTE DEFINITION TO SUPABASE
      await saveRouteDefinition({
        name: ctx.routeName.trim(),
        vehicleType: ctx.transportMode,
        originId: origin.id,
        destinationId: destination.id,
      });

      alert("Route saved successfully.");
      cancelBuilding();
    } catch (error) {
      console.error("COMMUTEWISE: FAILED TO SAVE ROUTE:", error);
      alert("Failed to save route. Please check the console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, saveRoute };
}
