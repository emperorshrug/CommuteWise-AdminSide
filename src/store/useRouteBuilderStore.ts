import { create } from "zustand";
import { Stop } from "../types";

export interface RoutePoint {
  id: string;
  stopId: string | null;
  name: string;
  type: "origin" | "destination" | "waypoint";
  order: number;
}

interface RouteBuilderState {
  isBuilding: boolean;
  routeName: string;
  distance: number;
  eta: number;
  fare: number;
  isFree: boolean;
  isStrict: boolean;
  transportMode: string;

  points: RoutePoint[];

  isSelectingOnMap: boolean;
  activePointIndex: number | null;

  startBuilding: () => void;
  cancelBuilding: () => void;
  // [FIX] Replaced 'any' with specific types
  setField: (
    field: keyof RouteBuilderState,
    value: string | number | boolean
  ) => void;

  addWaypoint: () => void;
  removeWaypoint: (index: number) => void;
  updatePoint: (index: number, stop: Stop) => void;
  swapPoints: (fromIndex: number, toIndex: number) => void;

  startMapSelection: (index: number) => void;
  confirmMapSelection: (stop: Stop) => void;
  cancelMapSelection: () => void;
}

export const useRouteBuilderStore = create<RouteBuilderState>((set, get) => ({
  isBuilding: false,
  routeName: "",
  distance: 0,
  eta: 0,
  fare: 0,
  isFree: false,
  isStrict: false,
  transportMode: "Jeepney",

  points: [
    { id: "origin", stopId: null, name: "", type: "origin", order: 0 },
    { id: "dest", stopId: null, name: "", type: "destination", order: 1 },
  ],

  isSelectingOnMap: false,
  activePointIndex: null,

  startBuilding: () =>
    set({
      isBuilding: true,
      routeName: "",
      distance: 0,
      eta: 0,
      fare: 0,
      isFree: false,
      isStrict: false,
      transportMode: "Jeepney",
      points: [
        { id: "origin", stopId: null, name: "", type: "origin", order: 0 },
        { id: "dest", stopId: null, name: "", type: "destination", order: 1 },
      ],
    }),

  cancelBuilding: () => set({ isBuilding: false, isSelectingOnMap: false }),

  setField: (field, value) => set((state) => ({ ...state, [field]: value })),

  addWaypoint: () =>
    set((state) => {
      const newPoints = [...state.points];
      const insertIndex = newPoints.length - 1;

      newPoints.splice(insertIndex, 0, {
        id: crypto.randomUUID(),
        stopId: null,
        name: "",
        type: "waypoint",
        order: insertIndex,
      });

      return { points: newPoints };
    }),

  removeWaypoint: (index) =>
    set((state) => {
      if (state.points[index].type !== "waypoint") return state;
      return { points: state.points.filter((_, i) => i !== index) };
    }),

  updatePoint: (index, stop) =>
    set((state) => {
      const newPoints = [...state.points];
      newPoints[index] = {
        ...newPoints[index],
        stopId: stop.id,
        name: stop.name,
      };
      return { points: newPoints };
    }),

  swapPoints: (fromIndex, toIndex) =>
    set((state) => {
      const newPoints = [...state.points];
      const [moved] = newPoints.splice(fromIndex, 1);
      newPoints.splice(toIndex, 0, moved);
      return { points: newPoints };
    }),

  startMapSelection: (index) =>
    set({ isSelectingOnMap: true, activePointIndex: index }),

  confirmMapSelection: (stop) => {
    const { activePointIndex, points } = get();
    if (activePointIndex !== null) {
      const newPoints = [...points];
      newPoints[activePointIndex] = {
        ...newPoints[activePointIndex],
        stopId: stop.id,
        name: stop.name,
      };
      set({
        points: newPoints,
        isSelectingOnMap: false,
        activePointIndex: null,
      });
    }
  },

  cancelMapSelection: () =>
    set({ isSelectingOnMap: false, activePointIndex: null }),
}));
