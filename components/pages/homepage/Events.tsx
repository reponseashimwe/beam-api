import Image from "next/image";

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

const EventsSection = () => {
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

          <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {events.map((event, index) => (
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
    </div>
  );
};

export default EventsSection;
