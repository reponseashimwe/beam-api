"use client";

import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import Link from "next/link";
import CustomButton from "@/components/common/form/Button";
import { useState } from "react";
import Logo from "@/app/logo";
import Field from "@/components/common/form/Field";
import ForwardedPasswordField from "@/components/common/form/PasswordField";

interface SignInFormInputs {
  email: string;
  password: string;
}

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();

  const onSubmit = async (data: SignInFormInputs) => {
    setLoading(true);
    await login(data.email, data.password);
    setLoading(false);
  };

  const changeInput = (key: string, value: any) => {
    setValue(key as any, value);
  };

  return (
    <>
      <p className="text-center text-gray-600 mb-6">
        Sign in to access your account and explore all the features of Beam.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col space-y-6"
      >
        <Field
          label="Email"
          register={register("email", { required: "Email is required" })}
          error={errors.email?.message}
          onValueChage={(value: string) => changeInput("email", value)}
          type="email"
        />
        <ForwardedPasswordField
          label="Password"
          {...register("password", { required: "Password is required" })}
          error={errors.password?.message}
        />

        <div className="w-full mt-4">
          <CustomButton
            label="Sign in"
            className="w-full"
            type="submit"
            isLoading={loading}
          />
        </div>
      </form>
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
};

export default SignInPage;
