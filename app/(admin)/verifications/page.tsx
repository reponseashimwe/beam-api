"use client";

import CustomButton from "@/components/common/form/Button";
import Checkbox from "@/components/common/form/Checkbox";
import Field from "@/components/common/form/Field";
import TextArea from "@/components/common/form/TextArea";
import Modal from "@/components/common/Modal";
import TabLink from "@/components/common/TabLink";
import PendingVerificationsTab from "@/components/pages/PendingVerifications";
import VerificationsTab from "@/components/pages/VerificationsTab";
import apiClient from "@/lib/axiosInstance";
import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import { Verification } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  return (
    <div className="w-full mt-6">
      <TabGroup>
        <div className="flex justify-between flex-col sm:flex-row gap-4">
          <TabPanels>
            <TabLink label="Pending verifications" />
            <TabLink label="Verifications" />
          </TabPanels>
          <div>
            <CustomButton label="Create" onClick={() => setFormOpened(true)} />
          </div>
        </div>

        <TabPanels>
          <TabPanel>
            <PendingVerificationsTab />
          </TabPanel>
          <TabPanel>
            <VerificationsTab />
          </TabPanel>
        </TabPanels>
      </TabGroup>
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
