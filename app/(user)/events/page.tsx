"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CustomButton from "@/components/common/form/Button";
import Field from "@/components/common/form/Field";
import TextArea from "@/components/common/form/TextArea";
import Modal from "@/components/common/Modal";
import Table from "@/components/table/Table";
import { Event } from "@prisma/client";
import axios from "axios";
import {
  useQuery,
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { getEvents } from "@/lib/queries/events";
import { getVerifications } from "@/lib/queries/verifications";
import apiClient from "@/lib/axiosInstance";
import { getCategories } from "@/lib/queries/categories";
import { CalendarDateRangeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import OptionsField from "@/components/common/form/OptionsField";

interface EventType
  extends Pick<
    Event,
    | "name"
    | "description"
    | "startDate"
    | "endDate"
    | "location"
    | "posterUrl"
    | "organizerId"
    | "ticketPrice"
    | "max_attendees"
  > {
  verificationIds: number[];
  categoryIds: number[];
}

type FormProps = {
  closeModal: () => void;
};

const CreateEventPage = () => {
  const [formOpened, setFormOpened] = useState(false);

  const { data: events, isLoading } = useQuery({
    queryFn: getEvents,
    queryKey: ["events"],
  });

  return (
    <>
      <div className="flex justify-between items-center gap-5 pt-6">
        <div className="text-lg font-bold">Events</div>
        <div>
          <CustomButton label="Create" onClick={() => setFormOpened(true)} />
        </div>
      </div>
      <div className="pt-8">
        <Table
          isLoading={isLoading}
          data={events || []}
          columns={{
            styles: {
              contaierStyle: "flex flex-col gap-6", // Flex column layout
              itemStyle: "w-full", // Full width for each item
            },
            render: (row: Event) => (
              <div className="w-full bg-white py-6 border-b flex gap-8 shadow-lg">
                <img
                  src={row.posterUrl}
                  alt={row.name}
                  className="w-1/3 h-auto object-cover rounded-md"
                />
                <div className="flex flex-col w-2/3 justify-between">
                  <div className="flex  gap-4 flex-col">
                    <div className="font-bold text-xl text-gray-900 mb-2">
                      {row.name}
                    </div>
                    <div className="flex gap-5">
                      <div className="flex gap-5">
                        <CalendarDateRangeIcon className="w-5 text-gray-500" />{" "}
                        {new Date(row.startDate).toDateString()} -{" "}
                        {new Date(row.endDate).toDateString()}
                      </div>
                      <div className="flex gap-5">
                        <MapPinIcon className="w-5 text-gray-500" />{" "}
                        {row.location}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 mb-4">
                      {row.description}
                    </div>
                  </div>
                </div>
              </div>
            ),
          }}
        />
      </div>
      {formOpened && (
        <Modal
          title="New Event"
          onClose={() => setFormOpened(false)}
          isOpen={formOpened}
        >
          <Form closeModal={() => setFormOpened(false)} />
        </Modal>
      )}
    </>
  );
};

const Form: FC<FormProps> = ({ closeModal }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventType>();

  const mutation = useMutation({
    mutationFn: async (data: EventType) => {
      const res = await apiClient.post("/events", data);
      return res;
    },
    onSuccess: (data) => {
      toast.success("Event created");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      closeModal();
    },
  });

  const create = (data: EventType) => {
    mutation.mutate(data);
  };

  const { data: verifications } = useQuery({
    queryFn: getVerifications,
    queryKey: ["verifications"],
  });

  const { data: categories } = useQuery({
    queryFn: getCategories,
    queryKey: ["categories"],
  });

  return (
    <form
      onSubmit={handleSubmit(create)}
      autoComplete="off"
      className="space-y-4 flex flex-col"
    >
      <Field
        register={register("name", { required: "Name is required" })}
        type="text"
        label="Name"
      />
      <TextArea
        register={register("description", {
          required: "Description is required",
        })}
        label="Description"
      />
      <Field
        register={register("startDate", {
          required: "Start Date is required",
        })}
        type="datetime-local"
        label="Start Date"
      />
      <Field
        register={register("endDate", {
          required: "End Date is required",
        })}
        type="datetime-local"
        label="End Date"
      />
      <Field
        register={register("location", {
          required: "Location is required",
        })}
        type="text"
        label="Location"
      />
      <Field
        register={register("posterUrl", {
          required: "Poster URL is required",
        })}
        type="url"
        label="Poster URL"
      />
      {verifications && (
        <div>
          <div className="font-bold">Required Verifications (Optional)</div>
          {verifications.map((verification) => (
            <div key={verification.id} className="flex items-center">
              <input
                type="checkbox"
                {...register("verificationIds")}
                value={verification.id}
                defaultChecked={false} // or use a condition to check if the verification is required
              />
              <label className="ml-2">{verification.name}</label>
            </div>
          ))}
        </div>
      )}
      {categories && (
        <div>
          <OptionsField
            label="Category"
            options={categories.map((c) => ({
              label: c.name,
              value: c.id.toString(),
            }))}
            register={register("categoryIds", { required: true })}
          />
        </div>
      )}
      <Field
        register={register("ticketPrice", {
          required: "Ticket Price is required",
        })}
        type="number"
        label="Ticket Price"
      />
      <Field
        register={register("max_attendees", {
          required: "Max Attendees is required",
        })}
        type="number"
        label="Max Attendees"
      />
      <CustomButton label="Create" type="submit" />
    </form>
  );
};

export default CreateEventPage;
