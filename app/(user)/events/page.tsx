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
    > {
    verificationIds: number[];
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
        <div className="w-full mt-6">
            <div className="flex justify-between items-center gap-5">
                <div className="text-lg font-bold">Events</div>
                <div>
                    <CustomButton
                        label="Create"
                        onClick={() => setFormOpened(true)}
                    />
                </div>
            </div>
            <div className="pt-6">
                <Table
                    isLoading={isLoading}
                    data={events || []}
                    columns={{
                        styles: {
                            contaierStyle:
                                "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
                            itemStyle: "flex w-full",
                        },
                        render: (row: Event) => (
                            <div className="w-full bg-white p-5 rounded-md flex flex-col gap-6 justify-between">
                                <div className="flex flex-col gap-2">
                                    <div className="font-bold text-gray-900">
                                        {row.name}
                                    </div>
                                    <div className="text-xs">
                                        {row.description}
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
        </div>
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
            const res = await axios.post("/api/events", data);
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
        <CustomButton label="Create" type="submit" />
      </form>
    );
};

export default CreateEventPage;
