// MonthCalendar.js
import { FC, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
// import "../../../calendar.css";
import { Event } from "@prisma/client";

type props = {
  user: number;
  data: Event[];
};

type eventType = {
  title: string;
  start: Date;
  end: Date;
  color: string;
};

const MonthCalendar: FC<props> = ({ data, user }) => {
  const [events, setEvents] = useState<eventType[] | undefined>();

  useEffect(() => {
    if (!events) {
      const mappedEvents = data.map((e) => ({
        title: `${e.name}`,
        start: e.startDate,
        end: e.endDate,
        color: getLeaveColor(e.organizerId === user),
      }));

      setEvents(mappedEvents);
    }
  }, [events, setEvents]);

  const getLeaveColor = (mine: boolean): string => {
    // Add your logic to assign colors based on leave types
    let color = "orange";
    if (mine) color = "blue";
    // else if (type.includes("sick")) color = "red";
    // else if (type.includes("one")) color = "blue";

    return color;
  };

  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    header: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    // defaultView: "timeGridWeek",
    events: events,
    displayEventTime: false,
    navLinks: false,
  };

  return (
    <div className="container max-w-4xl p-4 bg-white">
      <div className="mb-4 flex items-center justify-between"></div>
      {events && <FullCalendar {...calendarOptions} />}
    </div>
  );
};

export default MonthCalendar;
