"use client";

import Filter from "@/components/pages/homepage/Filter";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { SyncLoader } from "react-spinners";

const events = [
  {
    name: "Gaming hackathon",
    startDate: "2024-11-10",
    endDate: "2024-11-10",
    duration: "2 days",
    category: { name: "Arts" },
    description:
      "Ensure a safe and secure community with our robust user verification system.",
    url: "https://res.cloudinary.com/dxeepn9qa/image/upload/v1722330932/beam/bsk7ueglv0lwqbay0zgx.png",
  },
  {
    name: "UI / UX design webinar",
    startDate: "2024-11-10",
    endDate: "2024-11-10",
    duration: "2 days",
    category: { name: "Arts" },
    description:
      "Ensure a safe and secure community with our robust user verification system.",
    url: "https://res.cloudinary.com/dxeepn9qa/image/upload/v1722330932/beam/bsk7ueglv0lwqbay0zgx.png",
  },
  {
    name: "Gaming hackathon",
    startDate: "2024-11-10",
    endDate: "2024-11-10",
    duration: "2 days",
    category: { name: "Arts" },
    description:
      "Ensure a safe and secure community with our robust user verification system.",
    url: "https://res.cloudinary.com/dxeepn9qa/image/upload/v1722330932/beam/bsk7ueglv0lwqbay0zgx.png",
  },
  {
    name: "Gaming hackathon",
    startDate: "2024-11-10",
    endDate: "2024-11-10",
    duration: "2 days",
    category: { name: "Arts" },
    description:
      "Ensure a safe and secure community with our robust user verification system.",
    url: "https://res.cloudinary.com/dxeepn9qa/image/upload/v1722330932/beam/bsk7ueglv0lwqbay0zgx.png",
  },
  {
    name: "UI / UX design webinar",
    startDate: "2024-11-10",
    endDate: "2024-11-10",
    duration: "2 days",
    category: { name: "Arts" },
    description:
      "Ensure a safe and secure community with our robust user verification system.",
    url: "https://res.cloudinary.com/dxeepn9qa/image/upload/v1722330932/beam/bsk7ueglv0lwqbay0zgx.png",
  },
];

export type eventType = typeof events;

const EventsSection = () => {
  const [data, setData] = useState<eventType | undefined>(events);
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultLoaded, setDefaultLoaded] = useState<boolean>(false);
  const searchParams = localStorage.getItem("search");

  const defaultValues =
    searchParams != null ? JSON.parse(searchParams) : undefined;

  return (
    <main>
      <section className="content-grid bg-white  pt-10">
        <Filter
          setData={setData}
          setLoading={setLoading}
          defaultValues={defaultValues}
          redirect={false}
          defaultLoaded={defaultLoaded}
          setDefaultLoaded={setDefaultLoaded}
          showFilters={true}
        />
      </section>

      <section className="bg-white py-10 content-grid">
        {loading && <SyncLoader color="#00AAA9" className="rotate-90" />}

        <div className="">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
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

          <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {data?.map((event, index) => (
              <div
                key={index}
                className="w-full max-w-md bg-white rounded-xl flex flex-col gap-3"
              >
                <div className="w-full h-0 pb-[56.25%] relative rounded-xl">
                  {" "}
                  {/* Adjust padding-bottom to match the aspect ratio */}
                  <Image
                    src={event.url}
                    alt="Event"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    className="absolute rounded-xl inset-0 w-full h-full"
                  />
                </div>

                <div className="flex justify-between p-8 border mx-3 rounded-xl -mt-6">
                  <div>
                    <div className="text-gray-900 font-medium text-md">
                      {event.name}
                    </div>
                    <div className="text-gray-500 text-sm truncate-2">
                      {event.category.name}
                    </div>
                    <div className="text-gray-900 mt-3 line-clamp-2 text-xs">
                      {event.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default EventsSection;
