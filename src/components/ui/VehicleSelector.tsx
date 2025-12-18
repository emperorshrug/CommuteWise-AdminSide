import React from "react";

interface VehicleSelectorProps {
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  options,
  selectedValues,
  onToggle,
}) => {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        Allowed Vehicles
      </label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((v) => {
          const isSelected = selectedValues.includes(v);
          return (
            <div
              key={v}
              onClick={() => onToggle(v)}
              className={`cursor-pointer flex items-center gap-3 p-3 border rounded-lg transition-all ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/20"
                  : "border-slate-200 hover:border-emerald-300 bg-white"
              }`}
            >
              {/* HOLLOW CHECKBOX UI */}
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-[1px]" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  isSelected ? "text-emerald-800" : "text-slate-600"
                }`}
              >
                {v}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
