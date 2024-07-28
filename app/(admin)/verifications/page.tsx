"use client";

import CustomButton from "@/components/common/form/Button";
import Checkbox from "@/components/common/form/Checkbox";
import Field from "@/components/common/form/Field";
import TextArea from "@/components/common/form/TextArea";
import Modal from "@/components/common/Modal";
import Status from "@/components/common/Status";
import Table from "@/components/table/Table";
import apiClient from "@/lib/axiosInstance";
import { getVerifications } from "@/lib/queries/verifications";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Verification } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type VerificationType = Pick<
  Verification,
  "description" | "isAutoApproved" | "name" | "requiredDocs"
>;

type FormProps = {
  closeModal: () => void;
};

const Verifications = () => {
  const [formOpened, setFormOpened] = useState(false);

  const { data: verifications, isLoading } = useQuery({
    queryFn: getVerifications,
    queryKey: ["verifications"],
  });

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center gap-5">
        <div className="text-lg font-bold">Verifications</div>
        <div>
          <CustomButton label="Create" onClick={() => setFormOpened(true)} />
        </div>
      </div>
      <div className="pt-6">
        <Table
          isLoading={isLoading}
          data={verifications || []}
          columns={{
            styles: {
              contaierStyle:
                "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
              itemStyle: "flex w-full",
            },
            render: (row: Verification) => (
              <div className="w-full bg-white p-5 rounded-md flex flex-col gap-6 justify-between">
                <div className="flex flex-col gap-2">
                    <div className="font-bold text-gray-900">{row.name}</div>
                  <div className="text-xs">{row.description}</div>
                  <div className="flex gap-2">
                    {row.requiredDocs
                      .filter((doc) => doc.length > 0)
                      .map((doc: string, index: number) => (
                        <div
                          key={index}
                          className="px-2 py-1 text-xs rounded-md border"
                        >
                          {doc}
                        </div>
                      ))}
                  </div>
                </div>
                  <Status
                    status={row.isAutoApproved ? true : null}
                    trueText="Auto approved"
                    pendingText="Approval Required"
                  />
              </div>
            ),
          }}
        />
      </div>
      {formOpened && (
        <Modal
          title="New Verification"
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
  } = useForm<VerificationType>();

  const mutation = useMutation({
    mutationFn: async (data: VerificationType) => {
      const res = await apiClient.post(`/verifications/create`, data);
      return res;
    },
    onSuccess: (data) => {
      toast.success("Verification created");
      queryClient.invalidateQueries({ queryKey: ["verifications"] });
      closeModal();
    },
  });

  const create = (data: VerificationType) => {
    if (data.isAutoApproved) {
      data = { ...data, isAutoApproved: true };
    } else {
      data = { ...data, isAutoApproved: false };
    }

    mutation.mutate(data);
  };

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
        error={errors.name?.message}
      />

      <TextArea
        register={register("description", {
          required: "Description is required",
        })}
        rows={2}
        label="Description"
        error={errors.name?.message}
      />

      <Field
        type="text"
        register={register("requiredDocs", {})}
        label="Required uploads (separated by |)"
        error={errors.requiredDocs?.message}
      />

      <Checkbox
        label="Is auto approved"
        value={"0"}
        register={register("isAutoApproved")}
      />

      <CustomButton
        isLoading={mutation.isPending}
        label="Create"
        type="submit"
      />
    </form>
  );
};

export default Verifications;
