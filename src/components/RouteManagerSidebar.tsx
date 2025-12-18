// [FIX] Removed 'React' from import to solve the lint error
import StopList from "./sidebar/StopList";
import StopForm from "./sidebar/StopForm";
import SidebarHeader from "./sidebar/SidebarHeader";
import { useRouteStore } from "../store/useRouteStore";

export default function RouteManagerSidebar() {
  const { markers, selectedMarker, selectMarker, saveMarker } = useRouteStore();

  const handleSave = (
    name: string,
    type: "terminal" | "stop",
    vehicleTypes: string[],
    barangay: string
  ) => {
    if (selectedMarker) {
      saveMarker({
        ...selectedMarker,
        name,
        type,
        vehicleTypes,
        barangay,
      });
    }
  };

  return (
    <div className="w-96 bg-white h-full shadow-xl z-10 flex flex-col border-r border-slate-200">
      <SidebarHeader />

      <div className="flex-1 overflow-y-auto">
        {selectedMarker ? (
          <StopForm
            key={selectedMarker.id}
            location={selectedMarker}
            barangays={["Tandang Sora", "Pasong Tamo", "Culiat", "Sangandaan"]}
            vehicleOptions={["Jeepney", "Tricycle", "Bus", "UV Express"]}
            onSave={handleSave}
            onCancel={() => selectMarker(null)}
          />
        ) : (
          <StopList
            stops={markers}
            // [FIX] This now matches the interface in StopList.tsx
            onSelectStop={selectMarker}
          />
        )}
      </div>
    </div>
  );
}
