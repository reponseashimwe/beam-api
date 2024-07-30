"use client";

import Header from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import { ReactNode, useEffect } from "react";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/common/icon";
import Logo from "../logo";

const GuestLayout = ({ children }: { children: ReactNode }) => {
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser(false);
  }, []);

  return (
    <div className="min-h-screen w-full bg-bg bg-opacity-10 flex flex-col">
      <Header user={user} />
      <div className="w-full">{children}</div>

      <div className="border-t p-10 ">
        <div className="content-grid">
          <div className="py-5 mx-auto w-full flex  gap-8 md:gap-0 md:justify-between items-center  flex-col md:flex-row">
            <div>
              <Logo color="text-gray-900" className="w-20 h-fit" />
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 flex items-center justify-center">
                <FacebookIcon />
              </div>

              <div className="h-12 w-12 flex items-center justify-center">
                <InstagramIcon />
              </div>
              <div className="h-12 w-12 flex items-center justify-center">
                <LinkedinIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestLayout;
