// src/components/sidebar/StopManagerPanel.tsx

/**
 * CONTEXT: COMMUTEWISE STOP MANAGER PANEL
 * =======================================
 * THIS PANEL HANDLES THE "NORMAL" MODE:
 * - VEHICLE TABS
 * - SEARCH BAR
 * - STOP LIST / STOP FORM
 * - ENTRY POINT TO "CREATE NEW ROUTE"
 */

import { useState } from "react";
import { Plus } from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import StopList from "./StopList";
import StopForm from "./StopForm";
import RouteManagerTabs from "./RouteManagerTabs";
import StopSearchBar from "./StopSearchBar";
import { useRouteStore } from "../../store/useRouteStore";
import { useRouteBuilderStore } from "../../store/useRouteBuilderStore";
import type { Stop } from "../../types";

interface StopManagerPanelProps {
  onClose: () => void;
}

export default function StopManagerPanel({ onClose }: StopManagerPanelProps) {
  const { markers, selectedMarker, selectMarker, saveMarker } = useRouteStore();
  const { startBuilding } = useRouteBuilderStore();

  const [activeTab, setActiveTab] = useState<string>("Bus");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStops = markers.filter((stop) => {
    const matchesTab = stop.vehicleTypes.includes(activeTab);
    const matchesSearch =
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.barangay.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSaveStop = (
    name: string,
    type: "terminal" | "stop",
    vehicleTypes: string[],
    barangay: string
  ) => {
    if (!selectedMarker) return;

    const updated: Stop = {
      ...selectedMarker,
      name,
      type,
      vehicleTypes,
      barangay,
    };

    saveMarker(updated);
  };

  const handleCancelStop = () => {
    selectMarker(null);
  };

  return (
    <div className="w-md bg-white h-full shadow-xl z-10 flex flex-col border-r border-slate-200 transition-all">
      <SidebarHeader onClose={onClose} />

      {/* TABS */}
      <RouteManagerTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* CREATE ROUTE + SEARCH BAR */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <button
          onClick={startBuilding}
          className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <Plus size={16} /> Create New Route
        </button>

        <StopSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={`Search ${activeTab} stops...`}
        />
      </div>

      {/* MAIN CONTENT: STOP LIST OR STOP FORM */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {selectedMarker ? (
          <div className="bg-white min-h-full">
            <StopForm
              key={selectedMarker.id}
              location={selectedMarker}
              barangays={[
                "Tandang Sora",
                "Pasong Tamo",
                "Culiat",
                "Sangandaan",
              ]}
              vehicleOptions={["Bus", "Jeepney", "E-Jeepney", "Tricycle"]}
              onSave={handleSaveStop}
              onCancel={handleCancelStop}
            />
          </div>
        ) : (
          <StopList
            stops={filteredStops}
            onSelectStop={selectMarker}
            activeTab={activeTab}
          />
        )}
      </div>
    </div>
  );
}
