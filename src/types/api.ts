export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Student {
  id: number;
  email: string;
  full_name: string;
  role: string;
  bio: string | null;
  contact_number: string | null;
  photo: string | null;
}

export interface Professor {
  id: number;
  name: string;
  email: string;
  full_name: string;
  role: string;
  bio: string | null;
  contact_number: string | null;
  photo: string | null;
}

export interface Slot {
  value: string;
  display: string;
}

export interface Booking {
  id: number;
  title: string;
  professor_details: Professor;
  booking_date: string;
  time_slot: string;
  time_slot_display?: string;
  status: "pending" | "confirmed" | "cancelled";
  total_students?: number;
  notes?: string;
  students: number[] | Student[];
  created_at: string;
  updated_at?: string;
  approve: boolean;
}
