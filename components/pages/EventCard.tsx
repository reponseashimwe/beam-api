import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axiosInstance";
import {
  CalendarDateRangeIcon,
  MapPinIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  Event,
  UserVerification,
  Verification,
  VerificationOnEvent,
} from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CustomButton from "../common/form/Button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

export interface EventType extends Event {
  verifications: VerificationOnEvent[];
}

const EventCard = ({
  row,
  smallView,
}: {
  row: EventType;
  smallView?: boolean;
}) => {
  const [canNotRegister, setCanNotRegister] = useState<number>();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: { eventId: number }) => {
      const res = await apiClient.post(`/events/book`, data);
      return res;
    },

    onSuccess: () => {
      toast.success("Bookings");
      setCanNotRegister(1);

      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
  const { user } = useAuth();

  useEffect(() => {
    if (canNotRegister === undefined && user) {
      if (smallView) {
        setCanNotRegister(3);
      } else {
        console.log(row.name);
        const verificationsIds = row.verifications.map((v) => v.verificationId);
        const userVerifications = user.verifications.map(
          (v) => v.verificationId
        );
        const userBookings = user.bookings.map((b) => b.eventId);

        let can = 0;

        //   Event o
        if (user.id == row.organizerId) {
          can = 1;
        }
        if (row.max_attendees && row.max_attendees > 0) {
          if ((row.takenSeats || 0) > row.max_attendees) {
            can = 2;
          }
        }

        if (userBookings.includes(row.id)) {
          can = 3;
        }
        const hasVerif = userVerifications.some((v) =>
          verificationsIds.includes(v)
        );
        if (verificationsIds.length > 0 && !hasVerif) {
          can = 4;
        }

        setCanNotRegister(can);
      }
    }
  }, [user]);
  return (
    <div className="w-full bg-white p-6 rounded-md border-b flex gap-8 shadow-lg">
      {!smallView && (
        <img
          src={row.posterUrl}
          alt={row.name}
          className="w-1/3 h-auto object-cover rounded-md"
        />
      )}
      <div
        className={`flex flex-col ${smallView ? "" : "w-2/3"} justify-between`}
      >
        <div className="flex  gap-4 flex-col">
          <div className="font-bold text-xl text-gray-900 mb-2">{row.name}</div>
          <div className={`flex gap-5 ${smallView ? "flex-col" : ""}`}>
            <div className="flex gap-5">
              <CalendarDateRangeIcon className="w-5 text-orange-500" />{" "}
              {new Date(row.startDate).toDateString()} -{" "}
              {new Date(row.endDate).toDateString()} <br />
              {format(new Date(row.startDate), "hh:mm aa")} -{" "}
              {format(new Date(row.endDate), "hh:mm aa")}
            </div>
            <div className="flex gap-5">
              <MapPinIcon className="w-5 text-orange-500" /> {row.location}
            </div>
          </div>
          {!smallView && (
            <div className="flex gap-5">
              <TicketIcon className="w-5 text-orange-500" />{" "}
              {row.max_attendees ?? "Unlimited"} (Taken {row.takenSeats ?? 0})
            </div>
          )}
          {!smallView && (
            <>
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
              <div className="text-sm text-gray-700 mb-4">
                {row.description}
              </div>
            </>
          )}
        </div>
        <div>
          {user && !canNotRegister && (
            <CustomButton
              className="self-end bg-white text-black border border-black font-bold py-2 px-4 rounded hover:bg-gray-100"
              onClick={() => mutation.mutate({ eventId: row.id })}
              isLoading={mutation.isPending}
            >
              Register
            </CustomButton>
          )}

          {user && canNotRegister !== undefined && (
            <div className="p-2 text-sm">
              {canNotRegister == 1 && <>You are the owner</>}
              {canNotRegister == 2 && <>Seats taken</>}
              {canNotRegister == 3 && <>You have booked this</>}
              {canNotRegister == 4 && (
                <>
                  You are lacking some verifications.{" "}
                  <Link href={"/get-verified"}>Get verified</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
