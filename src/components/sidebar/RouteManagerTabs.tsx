// src/components/sidebar/RouteManagerTabs.tsx

/**
 * CONTEXT: COMMUTEWISE ROUTE MANAGER VEHICLE TABS
 * ===============================================
 * SIMPLE TAB BAR FOR:
 * - BUS
 * - JEEPNEY
 * - E-JEEPNEY
 * - TRICYCLE
 */

interface RouteManagerTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const TABS = ["Bus", "Jeepney", "E-Jeepney", "Tricycle"];

export default function RouteManagerTabs({
  activeTab,
  onChange,
}: RouteManagerTabsProps) {
  return (
    <div className="flex border-b border-slate-100 bg-slate-50">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
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
  );
}
