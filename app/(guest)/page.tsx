"use client";

import CustomButton from "@/components/common/form/Button";
import CategoriesSection from "@/components/pages/homepage/Categories";
import EventsSection from "@/components/pages/homepage/Events";
import FeaturesSection from "@/components/pages/homepage/Features";
import image from "@/public/speaker.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useScrollToHash = () => {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the '#' from the hash
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    };

    // Handle initial hash
    handleHashChange();

    // Handle hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Clean up listener on unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []); // Empty dependency array to only run once on mount
};

export default function Home() {
  useScrollToHash();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white ">
      <div className="min-h-[600px] relative content-grid ">
        <div className="flex justify-between flex-col md:flex-row-reverse gap-10 items-center min-h-full">
          <Image
            src={image}
            alt="Homepage"
            className="w-full h-auto md:max-w-md lg:max-w-[600px] object-cover"
          />
          <div className="w-full max-w-lg justify-between flex flex-col gap-10">
            <div className="text-gray-900 font-bold text-2xl">
              Effortlessly Manage Your Events with Beam
            </div>
            <div className="text-gray-700 text-sm">
              Welcome to Beam, the ultimate event management platform. Whether
              you're organizing a community gathering, corporate event, or
              personal celebration, our intuitive tools make it easy to create,
              manage, and promote your events. Join a growing community of event
              enthusiasts and professionals who trust Beam to handle their event
              needs
            </div>
            <div className="flex gap-6">
              <CustomButton
                label="Explore events"
                color="bg-orange-600"
                to="/explore"
              />
              <CustomButton label="Get started" to="/dashboard" />
            </div>
          </div>
        </div>
      </div>
      <FeaturesSection />
      <CategoriesSection />
      <EventsSection />
    </main>
  );
}
