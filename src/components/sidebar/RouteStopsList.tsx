// src/components/sidebar/RouteStopsList.tsx

/**
 * CONTEXT: COMMUTEWISE ROUTE STOPS LIST
 * =====================================
 * THIS COMPONENT RENDERS:
 * - "ROUTE STOPS" HEADER + "+ ADD WAYPOINT" BUTTON
 * - SCROLLABLE STACK OF RoutePointCard COMPONENTS
 * - SIMPLE DRAG-AND-DROP REORDERING
 */

import { useState, type DragEvent } from "react";
import { Plus } from "lucide-react";
import RoutePointCard from "../route-builder/RoutePointCard";
import type { RoutePoint } from "../../store/useRouteBuilderStore";
import type { Stop } from "../../types";

interface RouteStopsListProps {
  points: RoutePoint[];
  stops: Stop[];
  addWaypoint: () => void;
  removeWaypoint: (index: number) => void;
  updatePoint: (index: number, stop: Partial<Stop>) => void;
  startMapSelection: (index: number) => void;
  swapPoints: (fromIndex: number, toIndex: number) => void;
}

export default function RouteStopsList({
  points,
  stops,
  addWaypoint,
  removeWaypoint,
  updatePoint,
  startMapSelection,
  swapPoints,
}: RouteStopsListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    swapPoints(dragIndex, index);
    setDragIndex(null);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="flex flex-col gap-3 min-h-0">
      {/* HEADER + ADD WAYPOINT BUTTON */}
      <div className="flex justify-between items-center shrink-0">
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

      {/* SCROLLABLE STACK OF CARDS */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {points.map((point, index) => (
          <RoutePointCard
            key={point.id}
            point={point}
            index={index}
            stops={stops}
            isFirst={index === 0}
            isLast={index === points.length - 1}
            onStopSelect={(stop) => updatePoint(index, stop)}
            onSelectMap={() => startMapSelection(index)}
            onRemove={() => removeWaypoint(index)}
            onClear={() =>
              updatePoint(index, {
                id: undefined,
                name: "",
              })
            }
            onDragStart={() => handleDragStart(index)}
            onDrop={() => handleDrop(index)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            isDragging={dragIndex === index}
          />
        ))}
      </div>
    </div>
  );
}
