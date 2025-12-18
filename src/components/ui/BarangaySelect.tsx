import React, { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";

interface BarangaySelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  onGeocode: () => void;
  isLoadingGeocode: boolean;
}

export const BarangaySelect: React.FC<BarangaySelectProps> = ({
  value,
  onChange,
  options,
  onGeocode,
  isLoadingGeocode,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        Barangay
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full p-3 border border-slate-200 rounded-lg text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow bg-white"
            placeholder="Select or Search..."
            autoComplete="off"
          />
          {/* ARROW REMOVED AS REQUESTED */}
        </div>

        <button
          type="button"
          onClick={onGeocode}
          disabled={isLoadingGeocode}
          className="px-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50 flex items-center justify-center"
          title="Auto-detect Barangay"
        >
          <MapPin
            size={20}
            className={isLoadingGeocode ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* NEW LIGHT THEMED SUGGESTIONS */}
      {showSuggestions && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto ring-1 ring-black/5">
          {filteredOptions.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setShowSuggestions(false);
              }}
              className="px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors border-b border-slate-50 last:border-none"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
