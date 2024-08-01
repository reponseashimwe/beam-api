"use client";

import MonthCalendar from "@/components/pages/Calendar";
import { getUser } from "@/lib/queries/auth";
import { useQuery } from "@tanstack/react-query";

const DashboardPage = () => {
  const { data: user, isLoading } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
  });

  return (
    <>
      {isLoading && <p className="w-full py-20">Loading ...</p>}
      <div className="flex justify-center">
        {user && (
          <MonthCalendar
            data={user.bookings.map((b) => b.event).concat(user.events)}
            user={user.id}
          />
        )}
      </div>
    </>
  );
};

export default DashboardPage;
