"use client";

import CustomButton from "@/components/common/form/Button";
import Field from "@/components/common/form/Field";
import TextArea from "@/components/common/form/TextArea";
import Modal from "@/components/common/Modal";
import apiClient from "@/lib/axiosInstance";
import { Category } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type CategoryType = Pick<
  Category,
  "name" | "description"
>;

type FormProps = {
    closeModal: () => void;
};

const Categories = () => {
  const [formOpened, setFormOpened] = useState(false);

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center gap-5">
        <div className="text-lg font-bold">Categories</div>
        <div>
          <CustomButton label="Creaate" onClick={() => setFormOpened(true)} />
        </div>
      </div>
      {formOpened && (
        <Modal
          title="New Category"
          onClose={() => setFormOpened(false)}
          isOpen={formOpened}
        >
          <Form closeModal={() => setFormOpened(false)} />
        </Modal>
      )}
    </div>
  );
};

const Form:FC<FormProps> = ({ closeModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryType>();

  const mutation = useMutation({
    mutationFn: async (data: CategoryType) => {
      const res = await apiClient.post(`/categories/create`, data);
      return res;
    },
    onSuccess: (data) => {
      toast.success("Category created");
      closeModal();
    },
  });

  const create = (data: CategoryType) => {
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

      <CustomButton
        isLoading={mutation.isPending}
        label="Create"
        type="submit"
      />
    </form>
  );
};

export default Categories;
