import {
  GripVertical,
  Map,
  Trash2,
  X,
  Search as SearchIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import { RoutePoint } from "../../store/useRouteBuilderStore";
import { Stop } from "../../types";

interface RoutePointCardProps {
  point: RoutePoint;
  index: number;
  stops: Stop[];

  // CAPS LOCK COMMENT: CALLED WHEN USER PICKS A STOP FROM THE SEARCH DROPDOWN
  onStopSelect: (stop: Stop) => void;

  onRemove?: () => void;
  onSelectMap: () => void;
  onClear: () => void;
  isFirst: boolean;
  isLast: boolean;

  // CAPS LOCK COMMENT: DRAG & DROP HANDLERS TO REORDER CARDS
  onDragStart?: () => void;
  onDrop?: () => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}

export default function RoutePointCard({
  point,
  stops,
  onStopSelect,
  onRemove,
  onSelectMap,
  onClear,
  isFirst,
  isLast,
  onDragStart,
  onDrop,
  onDragOver,
  onDragEnd,
  isDragging,
}: RoutePointCardProps) {
  // CAPS LOCK COMMENT: QUERY DRIVES SEARCHABLE INPUT UX
  const [query, setQuery] = useState(point.name ?? "");
  const [isOpen, setIsOpen] = useState(false);

  // CAPS LOCK COMMENT: SYNC QUERY WHEN POINT NAME UPDATED EXTERNALLY (E.G. MAP SELECTION)
  useEffect(() => {
    setQuery(point.name ?? "");
  }, [point.name]);

  // CAPS LOCK COMMENT: FILTER STOPS BY NAME OR BARANGAY
  const filteredStops = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stops;

    return stops.filter((stop) => {
      const name = (stop.name || "").toLowerCase();
      const barangay = (stop.barangay || "").toLowerCase();
      return name.includes(q) || barangay.includes(q);
    });
  }, [stops, query]);

  // COLOR + ROLE LOGIC
  const dotColor = isFirst
    ? "bg-emerald-500"
    : isLast
    ? "bg-rose-500"
    : "bg-slate-400";

  const roleLabel = isFirst ? "Origin" : isLast ? "Destination" : "Waypoint";

  const baseCard =
    "flex items-center gap-3 p-3 rounded-xl shadow-sm group transition-all border";

  const cardColor = isFirst
    ? "bg-emerald-50 border-emerald-200"
    : isLast
    ? "bg-rose-50 border-rose-200"
    : "bg-white border-slate-200 hover:border-emerald-300";

  const draggingStyle = isDragging ? "opacity-80 ring-2 ring-emerald-400" : "";

  const placeholderText = isFirst
    ? "Search origin stop..."
    : isLast
    ? "Search destination stop..."
    : "Search waypoint stop...";

  const handleSelectStop = (stop: Stop) => {
    onStopSelect(stop);
    setQuery(stop.name || "");
    setIsOpen(false);
  };

  return (
    <div
      className={`${baseCard} ${cardColor} ${draggingStyle}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop?.();
      }}
      onDragOver={(event) => {
        onDragOver?.(event);
      }}
      onDragEnd={() => {
        onDragEnd?.();
      }}
    >
      {/* DRAG HANDLE */}
      <div className="text-slate-300 cursor-grab hover:text-slate-500">
        <GripVertical size={20} />
      </div>

      {/* DOT / CONNECTOR */}
      <div className="flex flex-col items-center justify-center gap-1 w-6">
        <div className={`w-3 h-3 rounded-full ${dotColor}`} />
      </div>

      {/* INPUT AREA */}
      <div className="flex-1 relative">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {roleLabel}
          </span>
        </div>

        <div className="relative">
          <SearchIcon
            size={14}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={query}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              // CAPS LOCK COMMENT: TIMEOUT LETS ONMOUSEDOWN RUN BEFORE DROPDOWN CLOSES
              setTimeout(() => setIsOpen(false), 120);
            }}
            placeholder={placeholderText}
            className="w-full pl-7 pr-8 py-2 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />

          {/* CLEAR BUTTON */}
          {query && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuery("");
                onClear();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
              title="Clear Selection"
            >
              <X size={14} />
            </button>
          )}

          {/* SEARCH DROPDOWN */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-1 max-h-52 bg-white border border-slate-200 rounded-lg shadow-lg overflow-y-auto z-20">
              {filteredStops.length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-400">
                  No stops found
                </div>
              )}

              {filteredStops.map((stop) => {
                const typeLabel =
                  stop.type === "terminal" ? "Terminal" : "Stop Point";
                const barangayLabel = stop.barangay || "";
                const meta = [typeLabel, barangayLabel]
                  .filter(Boolean)
                  .join(" • ");

                return (
                  <button
                    key={stop.id}
                    type="button"
                    onMouseDown={(e) => {
                      // CAPS LOCK COMMENT: USE MOUSEDOWN SO WE CAN SELECT BEFORE INPUT BLUR CLOSES DROPDOWN
                      e.preventDefault();
                      handleSelectStop(stop);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 flex flex-col gap-0.5"
                  >
                    <span className="font-semibold text-slate-800">
                      {stop.name || "Unnamed Stop"}
                    </span>
                    {meta && (
                      <span className="text-xs text-slate-500">{meta}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-1">
        {/* CAPS LOCK COMMENT: SELECT ON MAP BUTTON (EXPLICIT, NEVER TRIGGERED BY INPUT TYPING) */}
        <button
          onClick={onSelectMap}
          className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
          title="Select on Map"
        >
          <Map size={18} />
        </button>

        {/* DELETE ONLY FOR WAYPOINTS */}
        {!isFirst && !isLast && onRemove && (
          <button
            onClick={onRemove}
            className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove Waypoint"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
