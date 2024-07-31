import { Event } from "@prisma/client";
import apiClient from "../axiosInstance";

export const getEvents = async (): Promise<Event[]> => {
  return (await apiClient.get("events")).data;
};
