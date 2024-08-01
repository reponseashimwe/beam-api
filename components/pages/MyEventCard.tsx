import apiClient from "@/lib/axiosInstance";
import {
  CalendarDateRangeIcon,
  MapPinIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Event, User, UserBooking, VerificationOnEvent } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import Table from "../table/Table";
import Status from "../common/Status";
import CustomButton from "../common/form/Button";
import Modal from "../common/Modal";
import { format } from "date-fns";

export interface UserBookingType extends UserBooking {
  user: User;
  event: Event;
}

export interface MyEventType extends Event {
  verifications: VerificationOnEvent[];
  bookings: UserBookingType[];
}

const MyEventCard = ({
  row,
  smallView,
}: {
  row: MyEventType;
  smallView?: boolean;
}) => {
  const [applicantsOpen, setApplicantOpen] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: { eventId: number }) => {
      const res = await apiClient.post(`/events/book`, data);
      return res;
    },

    onSuccess: () => {
      toast.success("Bookings");

      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return (
    <div className="w-full bg-white py-6 border p-6 flex gap-8 rounded-md">
      <div className="flex flex-col ">
        <div className="flex  gap-4 flex-col">
          <div className="font-bold text-xl text-gray-900 mb-2">{row.name}</div>
          <div className="flex flex-col gap-5">
            <div className="flex  gap-5">
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

          <div className="flex gap-5">
            <TicketIcon className="w-5 text-orange-500" />{" "}
            {row.max_attendees ?? "Unlimited"} (Taken {row.takenSeats ?? 0})
          </div>
          {!smallView && (
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
          )}
        </div>
        <div className="mt-6">
          <CustomButton
            label="Attendees"
            onClick={() => setApplicantOpen(true)}
            color="bg-white text-green-500"
          />
        </div>
      </div>

      {applicantsOpen && (
        <Modal
          title="Event bookings"
          onClose={() => setApplicantOpen(false)}
          isOpen={applicantsOpen}
        >
          <Applicants bookings={row.bookings} />
        </Modal>
      )}
    </div>
  );
};
type props = {
  bookings: UserBookingType[];
};
const Applicants: FC<props> = ({ bookings }) => {
  return (
    <Table
      position="relative"
      data={bookings}
      columns={{
        styles: {
          contaierStyle: "flex flex-col gap-4",
          itemStyle: "w-full",
        },
        render: (row: UserBookingType) => (
          <div className="flex gap-4 border-b justify-between p-3">
            <div className="flex gap-4">
              <div className="h-10 aspect-square rounded-mb bg-gray-100 flex justify-center items-center">
                {row.user.name && row.user.name[0]}
              </div>
              <div>
                <div className="font-medium">{row.user.name}</div>
                <div className="text-gray-500">{row.user.email}</div>
              </div>
            </div>

            <div className="">
              <Status status={row.status} />
            </div>
          </div>
        ),
      }}
    />
  );
};

export default MyEventCard;
