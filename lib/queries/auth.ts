import { MyEventType, UserBookingType } from "@/components/pages/MyEventCard";
import apiClient from "../axiosInstance";
import { User, UserVerification, Verification } from "@prisma/client";

interface verificationType extends UserVerification {
  verification: Verification;
}

export interface UserType extends User {
  events: MyEventType[];
  bookings: UserBookingType[];
  verifications: verificationType[];
}

export const getUser = async (): Promise<UserType> => {
  return (await apiClient.get("/auth/me")).data;
};
