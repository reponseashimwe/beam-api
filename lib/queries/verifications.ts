import { Verification } from "@prisma/client";
import apiClient from "../axiosInstance";

export const getVerifications = async (): Promise<Verification[]> => {
  return (await apiClient.get("verifications")).data;
};
