"use client";

import { FC, useState } from "react";
import CustomButton from "@/components/common/form/Button";
import Field from "@/components/common/form/Field";
import TextArea from "@/components/common/form/TextArea";
import Modal from "@/components/common/Modal";
import Table from "@/components/table/Table";
import { Event } from "@prisma/client";
import {
  useQuery,
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { getVerifications } from "@/lib/queries/verifications";
import apiClient from "@/lib/axiosInstance";
import { getCategories } from "@/lib/queries/categories";
import OptionsField from "@/components/common/form/OptionsField";
import MyEventCard, { MyEventType } from "@/components/pages/MyEventCard";
import FileInput from "@/components/common/form/FileInput";
import { getUser } from "@/lib/queries/auth";

interface EventType
  extends Pick<
    Event,
    | "name"
    | "description"
    | "startDate"
    | "endDate"
    | "location"
    | "organizerId"
    | "ticketPrice"
    | "max_attendees"
  > {
  verificationIds: number[];
  categoryIds: number[];
  file: any;
  posterUrl?: string;
}

type FormProps = {
  closeModal: () => void;
};

const CreateEventPage = () => {
  const [formOpened, setFormOpened] = useState(false);

  const { data: user } = useQuery({ queryFn: getUser, queryKey: ["user"] });

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
          isLoading={user == null}
          data={user?.events || []}
          columns={{
            styles: {
              contaierStyle: "grid md:grid-cols-2 gap-6", // Flex column layout
              itemStyle: "w-full", // Full width for each item
            },
            render: (row: MyEventType) => <MyEventCard row={row} />,
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
  const [uploading, setUploading] = useState(false);

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
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setUploading(false);

      closeModal();
    },
  });

  const create = async (data: EventType) => {
    setUploading(true);
    try {
      let posterUrl = "";
      const formData = new FormData();
      formData.append("file", data.file[0]);
      formData.append("upload_preset", "online");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dxeepn9qa/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      posterUrl = result.secure_url;

      mutation.mutate({ ...data, posterUrl });
    } catch (error) {
      toast.error("File upload failed");
    } finally {
      setUploading(false);
    }
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
      <FileInput
        label={"Post Image"}
        register={register("file", { required: `Image is required` })}
        error={errors.file?.message as string}
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
      <CustomButton
        label="Create"
        type="submit"
        isLoading={uploading || mutation.isPending}
      />
    </form>
  );
};

export default CreateEventPage;
