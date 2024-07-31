"use client";

import Avatar from "@/components/common/Avatar";
import CustomButton from "@/components/common/form/Button";
import EventCard from "@/components/pages/EventCard";
import MyEventCard, { MyEventType } from "@/components/pages/MyEventCard";
import Table from "@/components/table/Table";
import { useAuth } from "@/context/AuthContext";
import { getUser } from "@/lib/queries/auth";
import { useQuery } from "@tanstack/react-query";

const DashboardPage = () => {
  const { data: user, isLoading } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
  });

  const verifications =
    user?.verifications
      .filter((v) => v.status === true)
      .map((v) => v.verification) || [];

  return (
    <div className="flex flex-col gap-5">
      <p className="w-full p-12 mt-6 bg-gray-100 rounded-md justify-between flex gap-6">
        <div className="flex gap-6 items-center">
          <Avatar user={user} bg="bg-white" />
          <div>
            <div className="text-lg font-bold">Hello {user?.name}!</div>
            <div>Find and create your next event</div>
          </div>
        </div>

        {user && (
          <div className="text-xs flex flex-col gap-3">
            {" "}
            {verifications.length || 0} verifications
            {verifications.length > 0 && (
              <> ({verifications.map((v) => v.name).join(", ")})</>
            )}
            <CustomButton
              label="Get more verifications"
              // color="bg-transparent"
              to="/get-verified"
            />
          </div>
        )}
      </p>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <>
          <div className="p-8 rounded-md flex-col gap-6 bg-gray-100">
            <div className="font-medium uppercase text-lg pb-5">
              Your bookings
            </div>

            <Table
              isLoading={user == null}
              data={user?.bookings.map((b) => b.event) || []}
              columns={{
                styles: {
                  contaierStyle: "grid gap-3", // Flex column layout
                  itemStyle: "w-full p-3", // Full width for each item
                },
                render: (row: MyEventType) => (
                  <EventCard row={row} smallView={true} />
                ),
              }}
            />
          </div>
          <div className="p-8 rounded-md flex-col gap-6 bg-gray-100">
            <div className="font-medium uppercase text-lg pb-5">
              Your events
            </div>
            <Table
              isLoading={user == null}
              data={user?.events || []}
              columns={{
                styles: {
                  contaierStyle: "grid gap-3", // Flex column layout
                  itemStyle: "w-full", // Full width for each item
                },
                render: (row: MyEventType) => (
                  <MyEventCard row={row} smallView={true} />
                ),
              }}
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default DashboardPage;
