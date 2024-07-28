"use client";

import CustomButton from "@/components/common/form/Button";
import Checkbox from "@/components/common/form/Checkbox";
import Field from "@/components/common/form/Field";
import TextArea from "@/components/common/form/TextArea";
import Modal from "@/components/common/Modal";
import apiClient from "@/lib/axiosInstance";
import { Verification } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type VerificationType = Pick<
  Verification,
  "description" | "isAutoApproved" | "name" | "requiredDocs"
>;

const Categories = () => {
  const [formOpened, setFormOpened] = useState(false);

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center gap-5">
        <div className="text-lg font-bold">Verifications</div>
        <div>
          <CustomButton label="Creaate" onClick={() => setFormOpened(true)} />
        </div>
        Create
      </div>
      {formOpened && (
        <Modal
          title="New Verification"
          onClose={() => setFormOpened(false)}
          isOpen={formOpened}
        >
          <Form />
        </Modal>
      )}
    </div>
  );
};

const Form = () => {
  const {
    register,
    setError,
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
    },
  });

  const create = (data: VerificationType) => {
    // if (data.requiredDocs && data.requiredDocs.length == 0) {
    //     setError("requiredDocs", {message: ""})
    // }

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

export default Categories;
