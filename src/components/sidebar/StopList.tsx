// [FIX] REMOVED 'import React'
import { MapPin, Bus, Navigation } from "lucide-react";
import { Stop } from "../../types";

interface StopListProps {
  stops: Stop[];
  onSelectStop: (marker: Stop) => void;
}

export default function StopList({ stops, onSelectStop }: StopListProps) {
  if (stops.length === 0) {
    return (
      <div className="p-10 text-center text-slate-400 flex flex-col items-center">
        <Navigation size={40} className="mb-4 opacity-50" />
        <p className="text-sm font-medium">No stops found.</p>
        <p className="text-xs mt-1">Click the map to add one.</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      {stops.map((stop) => {
        const isTerminal = stop.type === "terminal";
        return (
          <div
            key={stop.id}
            onClick={() => onSelectStop(stop)}
            className={`
              group flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
              ${
                isTerminal
                  ? "bg-red-50/50 border-red-100 hover:border-red-300 hover:shadow-md"
                  : "bg-white border-slate-100 hover:border-emerald-300 hover:shadow-md"
              }
            `}
          >
            {/* ICON BOX */}
            <div
              className={`
              w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors
              ${
                isTerminal
                  ? "bg-red-100 text-red-500"
                  : "bg-emerald-100 text-emerald-600"
              }
            `}
            >
              {isTerminal ? <Bus size={18} /> : <MapPin size={18} />}
            </div>

            {/* TEXT INFO */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-700 text-sm truncate group-hover:text-emerald-700 transition-colors">
                {stop.name || "Unnamed Point"}
              </h4>
              <p className="text-xs text-slate-400 truncate">
                {stop.barangay || "No Barangay"}
              </p>
            </div>

            {/* VEHICLE COUNT BADGE */}
            {stop.vehicleTypes.length > 0 && (
              <div className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold">
                {stop.vehicleTypes.length}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
