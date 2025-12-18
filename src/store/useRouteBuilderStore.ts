import { create } from "zustand";
import { Stop } from "../types";

export interface RoutePoint {
  id: string;
  stopId: string | null;
  name: string;
  type: "origin" | "destination" | "waypoint";
  order: number;
}

// CAPS LOCK COMMENT: ONLY THESE FIELDS ARE MUTATED VIA SETFIELD
type RouteBuilderField =
  | "routeName"
  | "distance"
  | "eta"
  | "fare"
  | "isFree"
  | "isStrict"
  | "transportMode";

interface RouteBuilderState {
  // CAPS LOCK COMMENT: TOP LEVEL ROUTE CONFIG
  isBuilding: boolean;
  routeName: string;
  distance: number;
  eta: number;
  fare: number;
  isFree: boolean;
  isStrict: boolean;
  transportMode: string;

  // CAPS LOCK COMMENT: ORDERED LIST OF ROUTE POINTS (ORIGIN -> ... WAYPOINTS ... -> DESTINATION)
  points: RoutePoint[];

  // CAPS LOCK COMMENT: MAP SELECTION MODE (USED WHEN USER CLICKS "SELECT ON MAP" FROM A ROUTE POINT CARD)
  isSelectingOnMap: boolean;
  activePointIndex: number | null;

  // CAPS LOCK COMMENT: CORE ACTIONS
  startBuilding: () => void;
  cancelBuilding: () => void;

  setField: (
    field: RouteBuilderField,
    value: string | number | boolean
  ) => void;

  addWaypoint: () => void;
  removeWaypoint: (index: number) => void;

  // CAPS LOCK COMMENT: UPDATEPOINT ACCEPTS PARTIAL STOP (USED FOR CLEARING OR APPLYING FULL STOP DATA)
  updatePoint: (index: number, stop: Partial<Stop>) => void;
  swapPoints: (fromIndex: number, toIndex: number) => void;

  startMapSelection: (index: number) => void;
  confirmMapSelection: (stop: Stop) => void;
  cancelMapSelection: () => void;
}

// CAPS LOCK COMMENT: ENSURE FIRST ITEM = ORIGIN, LAST = DESTINATION, MIDDLES = WAYPOINTS
const normalizePoints = (points: RoutePoint[]): RoutePoint[] =>
  points.map((point, index, array) => {
    let type: RoutePoint["type"] = "waypoint";
    if (index === 0) type = "origin";
    else if (index === array.length - 1) type = "destination";

    return {
      ...point,
      type,
      order: index,
    };
  });

// CAPS LOCK COMMENT: INITIAL STACK (ORIGIN + DESTINATION)
const createInitialPoints = (): RoutePoint[] =>
  normalizePoints([
    {
      id: "origin",
      stopId: null,
      name: "",
      type: "origin",
      order: 0,
    },
    {
      id: "dest",
      stopId: null,
      name: "",
      type: "destination",
      order: 1,
    },
  ]);

export const useRouteBuilderStore = create<RouteBuilderState>((set, get) => ({
  isBuilding: false,
  routeName: "",
  distance: 0,
  eta: 0,
  fare: 0,
  isFree: false,
  isStrict: false,
  transportMode: "Jeepney",

  points: createInitialPoints(),

  isSelectingOnMap: false,
  activePointIndex: null,

  startBuilding: () =>
    set({
      // CAPS LOCK COMMENT: RESET STATE FOR A FRESH ROUTE BUILD SESSION
      isBuilding: true,
      routeName: "",
      distance: 0,
      eta: 0,
      fare: 0,
      isFree: false,
      isStrict: false,
      transportMode: "Jeepney",
      points: createInitialPoints(),
      isSelectingOnMap: false,
      activePointIndex: null,
    }),

  cancelBuilding: () => set({ isBuilding: false, isSelectingOnMap: false }),

  setField: (field, value) =>
    set((state) => {
      // CAPS LOCK COMMENT: HARD CLAMP FARE TO NEVER GO BELOW ZERO
      if (field === "fare") {
        const numeric =
          typeof value === "number" ? value : Number(value as string);
        const safe = Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
        return { ...state, fare: safe };
      }

      return {
        ...state,
        [field]: value,
      } as RouteBuilderState;
    }),

  addWaypoint: () =>
    set((state) => {
      const newPoints = [...state.points];
      // CAPS LOCK COMMENT: INSERT NEW WAYPOINT JUST BEFORE DESTINATION
      const insertIndex = Math.max(newPoints.length - 1, 1);

      newPoints.splice(insertIndex, 0, {
        id: crypto.randomUUID(),
        stopId: null,
        name: "",
        type: "waypoint",
        order: insertIndex,
      });

      return { points: normalizePoints(newPoints) };
    }),

  removeWaypoint: (index) =>
    set((state) => {
      const target = state.points[index];
      // CAPS LOCK COMMENT: NEVER REMOVE ORIGIN/DESTINATION
      if (!target || target.type !== "waypoint") return state;

      const newPoints = state.points.filter((_, i) => i !== index);
      return { points: normalizePoints(newPoints) };
    }),

  updatePoint: (index, stop) =>
    set((state) => {
      const newPoints = [...state.points];
      const target = newPoints[index];
      if (!target) return state;

      newPoints[index] = {
        ...target,
        stopId: stop.id ?? null,
        name: stop.name ?? "",
      };

      return { points: normalizePoints(newPoints) };
    }),

  swapPoints: (fromIndex, toIndex) =>
    set((state) => {
      const newPoints = [...state.points];

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= newPoints.length ||
        toIndex >= newPoints.length
      ) {
        return state;
      }

      // CAPS LOCK COMMENT: BASIC DRAG-AND-DROP REORDER
      const [moved] = newPoints.splice(fromIndex, 1);
      newPoints.splice(toIndex, 0, moved);

      return { points: normalizePoints(newPoints) };
    }),

  startMapSelection: (index) =>
    set({ isSelectingOnMap: true, activePointIndex: index }),

  confirmMapSelection: (stop) => {
    const { activePointIndex, points } = get();
    if (activePointIndex === null) return;

    const newPoints = [...points];
    const target = newPoints[activePointIndex];
    if (!target) return;

    newPoints[activePointIndex] = {
      ...target,
      stopId: stop.id,
      name: stop.name,
    };

    set({
      points: normalizePoints(newPoints),
      isSelectingOnMap: false,
      activePointIndex: null,
    });
  },

  cancelMapSelection: () =>
    set({ isSelectingOnMap: false, activePointIndex: null }),
}));
