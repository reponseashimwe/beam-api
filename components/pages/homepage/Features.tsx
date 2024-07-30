import {
  BellAlertIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "User Verification",
    description:
      "Ensure a safe and secure community with our robust user verification system.",
    icon: CheckBadgeIcon,
  },
  {
    name: "Event Creation & Management",
    description:
      "Easily create and manage events with intuitive tools for organizers and attendees.",
    icon: CalendarIcon,
  },
  {
    name: "Attendee Management",
    description:
      "Seamlessly track and manage event attendees with real-time updates and notifications.",
    icon: ChartBarIcon,
  },
  {
    name: "Community Engagement",
    description:
      "Connect with users who share your interests and build lasting relationships.",
    icon: UsersIcon,
  },
];

const FeaturesSection = () => {
  return (
    <div id="features">
      <section className="bg-white py-20 content-grid">
        <div className="">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">
              Features
            </h2>
            <div className="text-sm font-medium border border-2 border-gray-300 rounded-md w-24"></div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="border rounded-md p-8">
                <div className="flex items-center">
                  <feature.icon className="h-12 w-12 text-orange-600" />
                </div>
                <h3 className="mt-4 text-md font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-2 text-base text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;
