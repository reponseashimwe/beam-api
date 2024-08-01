"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/axiosInstance";
import CustomButton from "@/components/common/form/Button";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/queries/categories";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const CategoriesSection = () => {
  const router = useRouter();
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const explore = (id: string) => {
    localStorage.setItem("search", JSON.stringify({ categoryId: id }));
    router.push("explore");
  };

  if (isLoading) {
    return <div id="categories">Loading...</div>;
  }

  return (
    <div id="categories">
      <div className="mt-6 bg-gray-100 content-grid py-16 flex flex-col justify-center gap-16">
        <div className="text-center flex justify-center items-center flex-col w-content">
          <h2 className="text-2xl text-orange-500 font-bold text-center mb-6">
            Event Categories
          </h2>
          <div className="text-sm font-medium border border-2 border-gray-300 rounded-md w-24"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="bg-white p-5 rounded-md shadow-md flex flex-col justify-between gap-6"
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-3">
                  <CalendarDaysIcon className="text-gray-600 w-5" />{" "}
                  {(category as any).events.length} events
                </div>
                <CustomButton
                  label="Explore"
                  color="bg-white text-orange-600 "
                  onClick={() => explore(category.id.toString())}
                  className="underline p-0 shadow-none hover:shadow-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
