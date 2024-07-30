import Table from "@/components/table/Table";
import { getEvents } from "@/lib/queries/events";
import { useQuery } from "@tanstack/react-query";
import EventCard, { EventType } from "../EventCard";

const EventsSection = () => {
  const { data: events, isLoading: loading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  return (
    <div>
      <section className="bg-white py-20 content-grid">
        <div className="">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">
              Nearest events
            </h2>
            <div className="text-sm font-medium border border-2 border-gray-300 rounded-md w-24"></div>
          </div>

          <Table
            isLoading={loading}
            data={events || []}
            columns={{
              styles: {
                contaierStyle: "flex flex-col gap-6", // Flex column layout
                itemStyle: "w-full", // Full width for each item
              },
              render: (row: EventType) => <EventCard row={row} />,
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default EventsSection;
