"use client";

import Header from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import { ReactNode, useEffect } from "react";

const GuestLayout = ({ children }: { children: ReactNode }) => {
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser(false);
  }, []);

  return (
    <div className="min-h-screen w-full bg-bg bg-opacity-10 flex flex-col">
      <Header user={user} />
      <div className="content-grid w-full full-width">{children}</div>
    </div>
  );
};

export default GuestLayout;
