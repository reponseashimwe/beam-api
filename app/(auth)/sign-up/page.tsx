"use client";

import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import CustomButton from "@/components/common/form/Button";
import { useState } from "react";
import { toast } from "react-toastify";

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const [loading, setLoading] = useState(false);

  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  const onSubmit = async (data: SignupFormInputs) => {
    setLoading(true);

    await registerUser(data.name, data.email, data.password);
    setLoading(false);
  };

  return (
    <div className="">
      <p className="text-center text-gray-600 mb-6">
        Create an account to get started with Beam and enjoy all its features.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col space-y-6"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="w-full mt-4">
          <CustomButton
            label="Sign up"
            className="w-full"
            type="submit"
            isLoading={loading}
          />
        </div>
      </form>
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
