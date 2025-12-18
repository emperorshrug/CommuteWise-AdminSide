import { create } from "zustand";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { Stop } from "../types";

// DB Types
type StopInsert = Database["public"]["Tables"]["stops"]["Insert"];

// Initialize Supabase Client
const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface RouteState {
  // STATE
  markers: Stop[];
  selectedMarker: Stop | null;
  tempMarker: { lat: number; lng: number } | null;
  isLoading: boolean;

  // ACTIONS
  fetchMarkers: () => Promise<void>;
  handleMapClick: (lat: number, lng: number) => void;
  selectMarker: (marker: Stop | null) => void;
  saveMarker: (marker: Stop) => Promise<void>;
  deleteMarker: (id: string) => Promise<void>;
}

export const useRouteStore = create<RouteState>((set, get) => ({
  markers: [],
  selectedMarker: null,
  tempMarker: null,
  isLoading: false,

  fetchMarkers: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from("stops").select("*");
      if (error) throw error;

      if (data) {
        const formattedData: Stop[] = data
          .map((item) => {
            const lat = Number(item.latitude);
            const lng = Number(item.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;
            return {
              id: item.id,
              lat,
              lng,
              type: (item.type || "stop").toLowerCase() as "terminal" | "stop",
              name: item.name || "Unnamed",
              barangay: item.barangay || "",
              vehicleTypes: item.vehicle_types || [],
            };
          })
          .filter((item): item is Stop => item !== null);

        set({ markers: formattedData });
      }
    } catch (error) {
      console.error("Error fetching markers:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  handleMapClick: (lat, lng) => {
    if (isNaN(lat) || isNaN(lng)) return;

    // 1. Set Ghost Marker
    set({ tempMarker: { lat, lng } });

    // 2. Logic: If a marker is already selected, just move it.
    // If nothing selected, create a new one.
    const currentSelected = get().selectedMarker;

    if (currentSelected) {
      set({
        selectedMarker: {
          ...currentSelected,
          lat,
          lng,
          barangay: "", // Reset barangay on move
        },
      });
    } else {
      set({
        selectedMarker: {
          id: crypto.randomUUID(),
          lat,
          lng,
          type: "stop",
          name: "",
          barangay: "",
          vehicleTypes: [],
        },
      });
    }
  },

  selectMarker: (marker) => {
    // If we select an existing marker, clear the ghost marker
    set({ selectedMarker: marker, tempMarker: null });
  },

  saveMarker: async (marker) => {
    set({ isLoading: true });
    try {
      const payload: StopInsert = {
        id: marker.id,
        latitude: marker.lat,
        longitude: marker.lng,
        type: marker.type,
        name: marker.name,
        barangay: marker.barangay,
        vehicle_types: marker.vehicleTypes,
      };

      const { error } = await supabase.from("stops").upsert(payload);
      if (error) throw error;

      await get().fetchMarkers();
      set({ selectedMarker: null, tempMarker: null });
    } catch (error) {
      console.error("Error saving marker:", error);
      alert("Failed to save marker.");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMarker: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.from("stops").delete().eq("id", id);
      if (error) throw error;

      set((state) => ({
        markers: state.markers.filter((m) => m.id !== id),
        selectedMarker: null,
      }));
    } catch (error) {
      console.error("Error deleting marker:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
