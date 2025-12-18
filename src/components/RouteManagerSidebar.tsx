import { useState } from "react";
import StopList from "./sidebar/StopList";
import StopForm from "./sidebar/StopForm";
import RouteBuilder from "./sidebar/RouteBuilder"; // [NEW]
import SidebarHeader from "./sidebar/SidebarHeader";
import { useRouteStore } from "../store/useRouteStore";
import { useRouteBuilderStore } from "../store/useRouteBuilderStore"; // [NEW]
import { Search, X, Plus } from "lucide-react"; // Added Plus icon

interface RouteManagerSidebarProps {
  onClose: () => void;
}

export default function RouteManagerSidebar({
  onClose,
}: RouteManagerSidebarProps) {
  const { markers, selectedMarker, selectMarker, saveMarker } = useRouteStore();
  const { isBuilding, startBuilding } = useRouteBuilderStore(); // [NEW]

  const [activeTab, setActiveTab] = useState<string>("Bus");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (
    name: string,
    type: "terminal" | "stop",
    vehicleTypes: string[],
    barangay: string
  ) => {
    if (selectedMarker) {
      saveMarker({ ...selectedMarker, name, type, vehicleTypes, barangay });
    }
  };

  const filteredStops = markers.filter((stop) => {
    const matchesTab = stop.vehicleTypes.includes(activeTab);
    const matchesSearch =
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.barangay.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = ["Bus", "Jeepney", "E-Jeepney", "Tricycle"];

  // [LOGIC] IF BUILDING ROUTE -> SHOW BUILDER
  if (isBuilding) {
    return (
      <div className="w-md bg-white h-full shadow-xl z-10 flex flex-col border-r border-slate-200 transition-all">
        <RouteBuilder />
      </div>
    );
  }

  return (
    <div className="w-md bg-white h-full shadow-xl z-10 flex flex-col border-r border-slate-200 transition-all">
      <SidebarHeader onClose={onClose} />

      <div className="flex border-b border-slate-100 bg-slate-50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? "bg-white text-emerald-600 border-b-2 border-emerald-500"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 border-b border-slate-100 space-y-3">
        {/* [NEW] CREATE ROUTE BUTTON */}
        <button
          onClick={startBuilding}
          className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <Plus size={16} /> Create New Route
        </button>

        {/* SEARCH BAR (With Clear Button) */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder={`Search ${activeTab} stops...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
              title="Clear Search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

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
              onSave={handleSave}
              onCancel={() => selectMarker(null)}
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
