import { GripVertical, MapPin, Trash2, X } from "lucide-react";
import { RoutePoint } from "../../store/useRouteBuilderStore";

interface RoutePointCardProps {
  point: RoutePoint;
  index: number;
  onRemove?: () => void;
  onSelectMap: () => void;
  onClear: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function RoutePointCard({
  point,
  onRemove,
  onSelectMap,
  onClear,
  isFirst,
  isLast,
}: RoutePointCardProps) {
  // Color Logic
  const dotColor = isFirst
    ? "bg-emerald-500"
    : isLast
    ? "bg-red-500"
    : "bg-slate-400";

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-emerald-300 transition-all">
      {/* DRAG HANDLE */}
      <div className="text-slate-300 cursor-grab hover:text-slate-500">
        <GripVertical size={20} />
      </div>

      {/* VISUAL CONNECTORS */}
      <div className="flex flex-col items-center justify-center gap-1 w-6">
        <div className={`w-3 h-3 rounded-full ${dotColor}`} />
      </div>

      {/* INPUT AREA */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={point.name}
          readOnly
          placeholder={
            isFirst
              ? "Select Origin..."
              : isLast
              ? "Select Destination..."
              : "Select Waypoint..."
          }
          className="w-full pl-3 pr-8 py-2 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
          onClick={onSelectMap} // Click text to also trigger map for UX
        />

        {/* CLEAR BUTTON */}
        {point.name && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
            title="Clear Selection"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSelectMap}
          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="Select on Map"
        >
          <MapPin size={18} />
        </button>

        {/* DELETE (Only for Waypoints) */}
        {!isFirst && !isLast && onRemove && (
          <button
            onClick={onRemove}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove Waypoint"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
