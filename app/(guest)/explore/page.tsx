"use client";

import EventCard, { EventType } from "@/components/pages/EventCard";
import Filter from "@/components/pages/homepage/Filter";
import Table from "@/components/table/Table";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Event } from "@prisma/client";
import { useState } from "react";

const EventsSection = () => {
  const [data, setData] = useState<Event[] | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultLoaded, setDefaultLoaded] = useState<boolean>(false);
  const searchParams = null;

  const defaultValues =
    searchParams != null ? JSON.parse(searchParams) : undefined;

  return (
    <main>
      <section className="content-grid bg-white  pt-10">
        <Filter
          setData={setData}
          setLoading={setLoading}
          defaultValues={defaultValues}
          defaultLoaded={defaultLoaded}
          setDefaultLoaded={setDefaultLoaded}
          showFilters={true}
        />
      </section>

      <section className="bg-white py-10 content-grid min-h-screen">
        <div className="">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6 ">
              Explore events
            </h2>
            <div className="text-sm font-medium border border-2 border-gray-300 rounded-md w-24"></div>
          </div>

          {data && data.length === 0 && (
            <div className="p-4 rounded-md text-xs bg-white flex gap-5">
              <div className="flex items-center justify-center h-12 aspect-square bg-red-500 rounded-md">
                <XMarkIcon className="text-white w-6" />
              </div>
              <div>
                <div className="font-medium">No results found!</div>
                <div>
                  There is no results found matching your filters! Try changing
                  them
                </div>
              </div>
            </div>
          )}

          <Table
            position="relative"
            isLoading={loading}
            data={data || []}
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
    </main>
  );
};

export default EventsSection;
