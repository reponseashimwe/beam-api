"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Navigation";
import { BarLoader } from "react-spinners";

const Dashboard = ({ children }: { children: ReactNode }) => {
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser(true);
  }, []);

  return (
    <>
      {user && (
        <div className="min-h-screen w-full bg-white flex flex-col">
          <Header user={user} />
          <div className="content-grid w-full full-width">{children}</div>
        </div>
      )}
      {user == null && (
        <div className="h-screen w-full bg-primary text-white flex items-center justify-center">
          <BarLoader color="#fff" />
        </div>
      )}
    </>
  );
};

export default Dashboard;
