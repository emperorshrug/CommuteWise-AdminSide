// src/services/routeService.ts

/**
 * CONTEXT: COMMUTEWISE ROUTE SERVICE FACADE
 * =========================================
 * THIS MODULE IS A SMALL FACADE THAT RE-EXPORTS:
 *
 * - MAPBOX / DIJKSTRA LOGIC (directionsService)
 * - SUPABASE PERSISTENCE LOGIC (routePersistenceService)
 *
 * BENEFITS:
 * - CALL SITES CAN SIMPLY IMPORT FROM "services/routeService".
 * - INTERNAL IMPLEMENTATION IS SPLIT INTO SMALLER, FOCUSED MODULES
 *   FOR MAINTAINABILITY AND CLARITY.
 */

export * from "./directionsService";
export * from "./routePersistenceService";
