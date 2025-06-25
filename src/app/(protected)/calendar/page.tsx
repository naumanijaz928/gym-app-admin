"use client";
import { EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useState } from "react";

// Define a type for events
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  status: string;
  color?: string;
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

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (data?.length) {
          // Assign color based on status
          setEvents(
            data.map((event: CalendarEvent) => ({
              ...event,
              ...getEventColors(event),
            }))
          );
          return;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("API load failed:", e);
      }
      // Fallback mock events
      setEvents(
        [
          {
            id: "1",
            title: "Yoga",
            start: "2025-06-25",
            status: "confirmed",
          },
          {
            id: "1.1",
            title: "Doga",
            start: "2025-06-25",
            status: "pending",
          },
          {
            id: "2",
            title: "PT",
            start: "2025-06-26T14:00:00",
            status: "confirmed",
          },
          {
            id: "2",
            title: "PT",
            start: "2025-06-26T14:00:02",
            status: "confirmed",
          },
          {
            id: "3",
            title: "Zumba 🎶",
            start: "2025-06-27T18:00:00",
            status: "cancelled",
          },
        ].map((event) => ({
          ...event,
          ...getEventColors(event),
        }))
      );
    }
    load();
  }, []);

  const handleDateClick = (arg: DateClickArg) => {
    // eslint-disable-next-line no-console
    console.log(arg, "Date Clicked");
    /* open booking modal for arg.startStr */
  };
  const handleEventClick = (arg: EventClickArg) => {
    // eslint-disable-next-line no-console
    console.log(arg, "Event Clicked");
    /* open booking/cancel dialog for arg.event.id */
  };

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
      />
    </div>
  );
}
