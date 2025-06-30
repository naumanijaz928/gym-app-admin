"use client";
import { EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useState } from "react";

import { TableLoader } from "@/components/ui/TableLoader";
import { apiFetch } from "@/lib/api";

// Define types based on the API response
interface ProfessorDetails {
  id: number;
  full_name: string;
  email: string;
}

interface StudentDetails {
  id: number;
  full_name: string;
  email: string;
}

interface BookingEvent {
  id: number;
  title: string | null;
  booking_date: string;
  time_slot: string;
  approve: boolean;
  status: "pending" | "confirmed" | "cancelled";
  total_students: number;
  notes: string;
  created_at: string;
  updated_at: string;
  visited: boolean;
  professor_details: ProfessorDetails;
  student_details: StudentDetails[];
}

// Define a type for calendar events
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  status: string;
  color?: string;
  backgroundColor?: string;
  extendedProps: {
    bookingId: number;
    professor: string;
    students: StudentDetails[];
    timeSlot: string;
    notes?: string;
    approved: boolean;
  };
}

function getEventColors(event: CalendarEvent): {
  color?: string;
  backgroundColor?: string;
} {
  const todayStr = new Date().toISOString().slice(0, 10);
  const isToday = event.start.slice(0, 10) === todayStr;
  let color, backgroundColor;

  // Status-based colors
  if (event.status === "pending") {
    color = "#ff9800";
    backgroundColor = "#ffecb3";
  } else if (event.status === "cancelled") {
    color = "#f44336";
    backgroundColor = "#ffcdd2";
  } else if (event.status === "confirmed") {
    color = "#4caf50";
    backgroundColor = "#c8e6c9";
  }

  // Override background for today
  if (isToday) {
    backgroundColor = "#1976d2";
    color = "#fff";
  }

  return { color, backgroundColor };
}

function formatBookingToCalendarEvent(booking: BookingEvent): CalendarEvent {
  // Create a proper title from booking data
  const title = booking.title || `Booking #${booking.id}`;

  // Format the date and time for the calendar
  const startDate = new Date(booking.booking_date);
  const [startTime] = booking.time_slot.split(" - ");
  const [hours, minutes] = startTime.split(":");
  startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  // Format students list
  // const students = booking.student_details.map((s) => s.full_name).join(", ");

  const event: CalendarEvent = {
    id: booking.id.toString(),
    title: `${title} (${booking.time_slot})`,
    start: startDate.toISOString(),
    status: booking.status,
    extendedProps: {
      bookingId: booking.id,
      professor: booking.professor_details.full_name,
      students: booking.student_details,
      timeSlot: booking.time_slot,
      notes: booking.notes,
      approved: booking.approve,
    },
  };

  return {
    ...event,
    ...getEventColors(event),
  };
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      setLoading(true);
      setError(null);
      try {
        const response: BookingEvent[] = await apiFetch(
          "/booking/bookings/filter_bookings/"
        );

        // Transform API response to calendar events
        const calendarEvents = response.map(formatBookingToCalendarEvent);
        setEvents(calendarEvents);
      } catch (e) {
        console.error("Failed to load bookings:", e);
        setError("Failed to load bookings. Please try again.");
        // Fallback to empty events
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  const handleDateClick = (arg: DateClickArg) => {
    console.log("Date Clicked:", arg.dateStr);
    // TODO: Open booking modal for the selected date
    // You can integrate this with your BookingModal component
  };

  const handleEventClick = (arg: EventClickArg) => {
    const event = arg.event;
    const extendedProps = event.extendedProps as CalendarEvent["extendedProps"];

    console.log("Event Clicked:", {
      bookingId: extendedProps.bookingId,
      title: event.title,
      professor: extendedProps.professor,
      students: extendedProps.students,
      timeSlot: extendedProps.timeSlot,
      status:
        event.backgroundColor === "#c8e6c9"
          ? "confirmed"
          : event.backgroundColor === "#ffecb3"
            ? "pending"
            : "cancelled",
      notes: extendedProps.notes,
      approved: extendedProps.approved,
    });

    // TODO: Open booking edit modal with the booking data
    // You can integrate this with your BookingModal component
  };

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <TableLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Custom style for FullCalendar header buttons */}
      <style>{`
        .fc .fc-button {
          background-color: #004481 !important;
          border-color: #004481 !important;
          color: #fff !important;
        }
        .fc .fc-button:hover, .fc .fc-button:focus {
          background-color: #003366 !important;
          border-color: #003366 !important;
        }
        .fc .fc-event {
          cursor: pointer;
        }
        .fc .fc-event-title {
          font-weight: 500;
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        eventDisplay="block"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
      />
    </div>
  );
}
