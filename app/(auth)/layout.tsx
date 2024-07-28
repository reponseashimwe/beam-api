// app/auth/layout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Logo from "../logo";
import Link from "next/link";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser(false);
  }, []);

  useEffect(() => {
    if (user !== null) {
      router.push("/dashboard");
    }
  });

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="w-full max-w-md p-8 space-y-8 bg-white flex flex-col shadow-md rounded-md">
          <Link href={"/"} className="flex justify-center mb-4 cursor-pointer">
            <Logo color="text-primary" className="h-8 w-fit" />
          </Link>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
