import { UserVerification, Verification } from "@prisma/client";
import apiClient from "../axiosInstance";

export const getVerifications = async (): Promise<Verification[]> => {
  return (await apiClient.get("verifications/get")).data;
};

export const getUserVerifications = async (): Promise<UserVerification[]> => {
  return (await apiClient.get("verifications/user-verifications")).data;
};

export const getPendingVerifications = async (): Promise<
  UserVerification[]
> => {
  return (await apiClient.get("verifications/all-pending-verifications")).data;
};
