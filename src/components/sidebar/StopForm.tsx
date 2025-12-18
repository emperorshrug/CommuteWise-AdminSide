import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Stop } from "../../types";
import { useGeocoding } from "../../hooks/useGeocoding";
import { VehicleSelector } from "../ui/VehicleSelector";
import { BarangaySelect } from "../ui/BarangaySelect";

interface StopFormProps {
  location: Stop;
  barangays: string[];
  vehicleOptions: string[];
  onSave: (
    name: string,
    type: "terminal" | "stop",
    vehicleTypes: string[],
    barangay: string
  ) => void;
  onCancel: () => void;
}

export default function StopForm({
  location,
  barangays,
  vehicleOptions,
  onSave,
  onCancel,
}: StopFormProps) {
  // STATE
  const [name, setName] = useState(location.name || "");
  const [type, setType] = useState<"terminal" | "stop">(
    location.type || "stop"
  );
  const [barangay, setBarangay] = useState(location.barangay || "");
  const [vehicleTypes, setVehicleTypes] = useState<string[]>(
    location.vehicleTypes || []
  );

  const { getBarangay, isLoadingAddress } = useGeocoding();

  // [FIX] TRACK PREVIOUS PROP TO DETECT DRAG EVENTS SAFELY
  const prevBarangayProp = useRef(location.barangay);

  useEffect(() => {
    // Logic: Only reset if the PROP changed from "Something" to "Empty"
    // This happens when the user drags an existing pin to a new spot.
    if (prevBarangayProp.current !== "" && location.barangay === "") {
      // [FIX] Wrap in setTimeout to satisfy "no-synchronous-updates" rule
      setTimeout(() => setBarangay(""), 0);
    }
    // Update the ref for the next render
    prevBarangayProp.current = location.barangay;
  }, [location.barangay]);

  const handleGeocode = async () => {
    const found = await getBarangay(location.lat, location.lng);
    if (found) setBarangay(found);
    else alert("Could not determine barangay.");
  };

  const handleVehicleToggle = (v: string) => {
    setVehicleTypes((prev) =>
      prev.includes(v) ? prev.filter((i) => i !== v) : [...prev, v]
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(name, type, vehicleTypes, barangay);
      }}
      className="p-5 space-y-5"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-xl text-slate-800 tracking-tight">
          {location.id && location.name ? "Edit Point" : "New Point"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close Form"
          className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Point Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-lg text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow placeholder:text-slate-400"
          placeholder="e.g. Tandang Sora Bayan"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Point Type
        </label>
        <div className="flex p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setType("stop")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === "stop"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Regular Stop
          </button>
          <button
            type="button"
            onClick={() => setType("terminal")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === "terminal"
                ? "bg-white text-red-500 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Terminal
          </button>
        </div>
      </div>

      <BarangaySelect
        value={barangay}
        onChange={setBarangay}
        options={barangays}
        onGeocode={handleGeocode}
        isLoadingGeocode={isLoadingAddress}
      />

      <VehicleSelector
        options={vehicleOptions}
        selectedValues={vehicleTypes}
        onToggle={handleVehicleToggle}
      />

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/30 transition-all font-bold text-base tracking-wide active:scale-[0.98]"
        >
          Save Point
        </button>
      </div>
    </form>
  );
}
