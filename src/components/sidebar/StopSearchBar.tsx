// src/components/sidebar/StopSearchBar.tsx

/**
 * CONTEXT: COMMUTEWISE STOP SEARCH BAR
 * ====================================
 * REUSABLE SEARCH INPUT WITH:
 * - SEARCH ICON
 * - CLEAR BUTTON
 */

import { Search, X } from "lucide-react";

interface StopSearchBarProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function StopSearchBar({
  value,
  placeholder,
  onChange,
}: StopSearchBarProps) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
          title="Clear Search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
