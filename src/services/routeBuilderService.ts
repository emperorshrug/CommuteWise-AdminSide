// src/services/routeBuilderService.ts

/**
 * CONTEXT: COMMUTEWISE ROUTE BUILDER DOMAIN LOGIC
 * ===============================================
 * THIS MODULE CONTAINS PURE, NON-REACT LOGIC USED BY THE ROUTE BUILDER.
 *
 * RESPONSIBILITIES:
 * - VALIDATE THAT A ROUTE BUILDER SESSION IS "SAVEABLE".
 * - RESOLVE BUILDER POINTS -> ACTUAL STOP OBJECTS (ORIGIN / WAYPOINTS / DEST).
 *
 * IMPORTANT:
 * - THIS FILE HAS NO KNOWLEDGE OF SUPABASE OR MAPBOX.
 * - IT WORKS PURELY ON IN-MEMORY DATA STRUCTURES SO IT IS EASY TO TEST.
 */

import type { RoutePoint } from "../store/useRouteBuilderStore";
import type { Stop } from "../types";

export interface BuildRouteContext {
  routeName: string;
  transportMode: string;
  isFree: boolean;
  fare: number;
  isStrict: boolean;
  points: RoutePoint[];
  markers: Stop[];
}

export interface RouteStopsResolution {
  origin: Stop;
  destination: Stop;
  orderedStops: Stop[];
}

/**
 * VALIDATE ROUTE CONTEXT
 * ======================
 * RETURNS A LIST OF HUMAN-READABLE ERROR MESSAGES.
 * IF THE ARRAY IS EMPTY, THE CONTEXT IS CONSIDERED VALID.
 */
export function validateRouteContext(ctx: BuildRouteContext): string[] {
  const errors: string[] = [];
  const trimmedName = ctx.routeName.trim();

  if (!trimmedName) {
    errors.push("Route name is required.");
  }

  if (!ctx.points || ctx.points.length < 2) {
    errors.push("A route must have at least an origin and a destination.");
  }

  if (!ctx.markers || ctx.markers.length === 0) {
    errors.push("No stops exist yet. Please create at least one stop first.");
    return errors;
  }

  const stopById = new Map(ctx.markers.map((m) => [m.id, m]));

  ctx.points.forEach((point, index) => {
    const label =
      index === 0
        ? "origin"
        : index === ctx.points.length - 1
        ? "destination"
        : `waypoint #${index}`;

    if (!point.stopId) {
      errors.push(`The ${label} does not have a selected stop.`);
      return;
    }

    if (!stopById.has(point.stopId)) {
      errors.push(
        `The ${label} references a stop that no longer exists. Please re-select it.`
      );
    }
  });

  // OPTIONAL: WARN IF ORIGIN = DESTINATION
  if (
    ctx.points.length >= 2 &&
    ctx.points[0].stopId &&
    ctx.points[ctx.points.length - 1].stopId &&
    ctx.points[0].stopId === ctx.points[ctx.points.length - 1].stopId
  ) {
    errors.push(
      "Origin and destination are the same stop. Please choose different stops."
    );
  }

  return errors;
}

/**
 * RESOLVE ROUTE STOPS
 * ===================
 * ASSUMES THE CONTEXT HAS PASSED VALIDATION.
 * MAPS EACH ROUTE POINT -> ITS CORRESPONDING STOP OBJECT.
 */
export function resolveRouteStops(
  ctx: BuildRouteContext
): RouteStopsResolution {
  const stopById = new Map(ctx.markers.map((m) => [m.id, m]));

  const orderedStops: Stop[] = ctx.points.map((point, index) => {
    if (!point.stopId) {
      throw new Error(`Route point at index ${index} has no stopId.`);
    }
    const stop = stopById.get(point.stopId);
    if (!stop) {
      throw new Error(
        `Stop with id ${point.stopId} not found in markers when resolving route stops.`
      );
    }
    return stop;
  });

  if (orderedStops.length < 2) {
    throw new Error("Resolved route has fewer than 2 stops.");
  }

  const origin = orderedStops[0];
  const destination = orderedStops[orderedStops.length - 1];

  return { origin, destination, orderedStops };
}
