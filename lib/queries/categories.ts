import { Category } from "@prisma/client";
import apiClient from "../axiosInstance";

export const getCategories = async (): Promise<Category[]> => {
  return (await apiClient.get("categories")).data;
};
