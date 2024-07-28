"use client";

import { useAuth } from "@/context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  return <p className="w-full py-20">Here is dashboard for {user?.name}</p>;
};

export default DashboardPage;
