import { Plus, Save, X } from "lucide-react";
import { useRouteBuilderStore } from "../../store/useRouteBuilderStore";
import RoutePointCard from "../route-builder/RoutePointCard";
import { Stop } from "../../types"; // [FIX] Import Stop type

export default function RouteBuilder() {
  const {
    points,
    routeName,
    fare,
    isFree,
    isStrict,
    transportMode, // [FIX] Removed distance, eta
    setField,
    addWaypoint,
    removeWaypoint,
    updatePoint,
    startMapSelection,
    cancelBuilding,
  } = useRouteBuilderStore();

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm">
        <h3 className="font-bold text-lg text-slate-800">New Route</h3>
        <button
          onClick={cancelBuilding}
          className="text-slate-400 hover:text-slate-600"
          aria-label="Close Route Builder" // [FIX] Added aria-label
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-3">
          <div>
            <label
              htmlFor="route-name"
              className="text-xs font-bold text-slate-500 uppercase"
            >
              Route Name
            </label>
            <input
              id="route-name" // [FIX] Added ID
              type="text"
              value={routeName}
              onChange={(e) => setField("routeName", e.target.value)}
              placeholder="e.g. SM North - Fairview"
              className="w-full mt-1 p-2 border rounded-lg text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="transport-mode"
                className="text-xs font-bold text-slate-500 uppercase"
              >
                Mode
              </label>
              <select
                id="transport-mode" // [FIX] Added ID
                value={transportMode}
                onChange={(e) => setField("transportMode", e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
              >
                <option>Jeepney</option>
                <option>Bus</option>
                <option>E-Jeepney</option>
                <option>Tricycle</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="fare-input"
                className="text-xs font-bold text-slate-500 uppercase"
              >
                Fare (PHP)
              </label>
              <input
                id="fare-input" // [FIX] Added ID
                type="number"
                value={fare}
                disabled={isFree}
                onChange={(e) => setField("fare", Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded-lg text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => setField("isFree", e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              Free Ride
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isStrict}
                onChange={(e) => setField("isStrict", e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              Strict Stops
            </label>
          </div>
        </div>

        <hr className="border-slate-200" />

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Route Stops
            </label>
            <button
              onClick={addWaypoint}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <Plus size={14} /> Add Waypoint
            </button>
          </div>

          <div className="space-y-2">
            {points.map((point, index) => (
              <RoutePointCard
                key={point.id}
                point={point}
                index={index}
                isFirst={index === 0}
                isLast={index === points.length - 1}
                onSelectMap={() => startMapSelection(index)}
                onRemove={() => removeWaypoint(index)}
                // [FIX] Replaced 'any' with Partial<Stop> logic
                onClear={() => updatePoint(index, { id: "", name: "" } as Stop)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all">
          <Save size={18} /> Save Route
        </button>
      </div>
    </div>
  );
}
