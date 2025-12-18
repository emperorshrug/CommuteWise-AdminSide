// CAPS LOCK COMMENT: ENSURE THIS FILE EXISTS AT src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      stops: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          latitude: number;
          longitude: number;
          type: "TERMINAL" | "STOP";
        };
        Insert: {
          id: string; // REQUIRED BECAUSE WE GENERATE IT CLIENT-SIDE
          created_at?: string;
          name: string;
          latitude: number;
          longitude: number;
          type: "TERMINAL" | "STOP";
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          latitude?: number;
          longitude?: number;
          type?: "TERMINAL" | "STOP";
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
