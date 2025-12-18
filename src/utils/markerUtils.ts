// [FIX] Removed unused 'Stop' import
export const getMarkerStyle = (vehicleTypes: string[]) => {
  // RULE 1: MIXED TYPES -> YELLOW
  if (vehicleTypes.length > 1) {
    return {
      color: "#EAB308",
      colorClass: "bg-yellow-500", // [NEW] Tailwind Class
      icon: "🚍",
    };
  }

  const type = vehicleTypes[0] || "";

  // RULE 2: SPECIFIC TYPES
  switch (type) {
    case "Bus":
      return {
        color: "#3B82F6",
        colorClass: "bg-blue-500",
        icon: "🚍",
      };
    case "Jeepney":
      return {
        color: "#8B5CF6",
        colorClass: "bg-violet-500",
        icon: "🚍",
      };
    case "E-Jeepney":
      return {
        color: "#D946EF",
        colorClass: "bg-fuchsia-500", // 'Magenta' maps to Fuchsia in Tailwind
        icon: "🚍",
      };
    case "Tricycle":
      return {
        color: "#22C55E",
        colorClass: "bg-green-500",
        icon: "🛺",
      };
    default:
      return {
        color: "#64748B",
        colorClass: "bg-slate-500",
        icon: "📍",
      };
  }
};
