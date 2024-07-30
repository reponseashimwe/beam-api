import {
  CalendarDateRangeIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Event, UserVerification } from "@prisma/client";

export interface EventType extends Event {
  verifications: UserVerification[];
}

const EventCard = ({ row }: { row: EventType }) => {
  return (
    <div className="w-full bg-white py-6 border-b flex gap-8 shadow-lg">
      <img
        src={row.posterUrl}
        alt={row.name}
        className="w-1/3 h-auto object-cover rounded-md"
      />
      <div className="flex flex-col w-2/3 justify-between">
        <div className="flex  gap-4 flex-col">
          <div className="font-bold text-xl text-gray-900 mb-2">{row.name}</div>
          <div className="flex gap-5">
            <div className="flex gap-5">
              <CalendarDateRangeIcon className="w-5 text-orange-500" />{" "}
              {new Date(row.startDate).toDateString()} -{" "}
              {new Date(row.endDate).toDateString()}
            </div>
            <div className="flex gap-5">
              <MapPinIcon className="w-5 text-orange-500" /> {row.location}
            </div>
          </div>

          <div className="flex gap-5">
            <UserGroupIcon className="w-5 text-orange-500" /> For{" "}
            {row.verifications.length > 0 && (
              <>
                {row.verifications
                  .map((v: any) => v.verification.name)
                  .join(", ")}
              </>
            )}
            {row.verifications.length == 0 && <>All people</>}
          </div>
          <div className="text-sm text-gray-700 mb-4">{row.description}</div>
        </div>
        <div>
          <button className="self-end bg-white text-black border border-black font-bold py-2 px-4 rounded hover:bg-gray-100">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
