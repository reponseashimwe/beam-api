"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiClient from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import CustomButton from "@/components/common/form/Button";
import { useForm } from "react-hook-form";
import Field from "@/components/common/form/Field";
import Link from "next/link";

const VerifyEmailPage = ({
  searchParams,
}: {
  searchParams: { token?: string | string[] };
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();
  const token = Array.isArray(searchParams.token)
    ? searchParams.token[0]
    : searchParams.token;

  const mutation = useMutation({
    mutationFn: async (token: string) => {
      setLoading(true);
      const res = await apiClient.get(`/auth/verify-email?token=${token}`);
      setLoading(false);
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      router.push("/sign-in");
    },
    onError: () => {
      setLoading(false);
    },
  });

  const resendLinkmutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      setLoading(true);
      const res = await apiClient.post(`/auth/send-verify-email`, data);
      setLoading(false);
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const handleResendLink = async (data: { email: string }) => {
    resendLinkmutation.mutate(data);
  };

  if (mutation.isPending) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-center">Verifying your email address...</p>
        <Link
          href="/sign-in"
          className="text-primary font-bold hover:underline mt-6 flex text-center justify-center"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (mutation.isError) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-center">Failed to verify email. Please try again.</p>
        <Link
          href="/sign-in"
          className="text-primary font-bold hover:underline mt-6 flex text-center justify-center"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (resendLinkmutation.isSuccess) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-center">Verification send. Check your email</p>
        <Link
          href="/sign-in"
          className="text-primary font-bold hover:underline mt-6 flex text-center justify-center"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-center">Send your email to get verification email</p>
        <form
          onSubmit={handleSubmit(handleResendLink)}
          autoComplete="off"
          className="space-y-4 flex flex-col"
        >
          <Field
            register={register("email", { required: "Email is required" })}
            type="text"
            placeholder="Email to resend link"
            error={errors.email?.message}
          />

          <CustomButton
            isLoading={loading}
            label="Resend Verification Link"
            type="submit"
          />
        </form>
        <Link
          href="/sign-in"
          className="text-primary font-bold hover:underline mt-6 flex text-center justify-center"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-center">
        Click the button below to get your email verified
      </p>
      <p className="w-full">
        <CustomButton
          className="w-full"
          onClick={() => mutation.mutate(token as string)}
        >
          Verify
        </CustomButton>
      </p>
      <Link
        href="/sign-in"
        className="text-primary font-bold hover:underline mt-6 flex text-center justify-center"
      >
        Sign in
      </Link>
    </div>
  );
};

export default VerifyEmailPage;
