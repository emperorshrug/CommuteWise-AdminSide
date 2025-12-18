export interface Stop {
  id: string;
  name: string;
  type: "terminal" | "stop"; // LOWERCASE TO MATCH DB
  lat: number;
  lng: number;
  vehicleTypes: string[];
  barangay: string;
}
