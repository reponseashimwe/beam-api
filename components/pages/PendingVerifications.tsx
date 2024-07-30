"use client";

import CustomButton from "@/components/common/form/Button";
import Modal from "@/components/common/Modal";
import Status from "@/components/common/Status";
import Table from "@/components/table/Table";
import apiClient from "@/lib/axiosInstance";
import { getPendingVerifications } from "@/lib/queries/verifications";
import { User, UserVerification, Verification } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/20/solid";
import {
  ClockIcon,
  DocumentIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import TextArea from "../common/form/TextArea";
import Field from "../common/form/Field";

interface UserVerificationType extends UserVerification {
  verification: Verification;
  user: User;
}

const PendingVerificationsTab = () => {
  const [formOpened, setFormOpened] = useState(false);
  const [approveVerification, setApproveVerification] = useState<string>();
  const [type, setType] = useState("");
  const [selectedVerification, setSelectedVerification] =
    useState<UserVerification>();

  const { data: userVerifications, isLoading } = useQuery({
    queryFn: getPendingVerifications,
    queryKey: ["pending_verifications"],
  });
  const queryClient = useQueryClient();
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`/verifications/approve`, { id });
      return res;
    },
    onSuccess: () => {
      toast.success("Verification approved");
      queryClient.invalidateQueries({ queryKey: ["pending_verifications"] });
      setApproveVerification(undefined);
    },
  });

  return (
    <div className="w-full mt-6">
      <div className="pt-6">
        <div
          className={`flex gap-6 ${
            userVerifications && userVerifications.length == 0
              ? "flex-col"
              : "flex-col lg:flex-row"
          }`}
        >
          <div className="w-full">
            <div>
              <Table
                isLoading={isLoading}
                data={userVerifications || []}
                columns={{
                  styles: {
                    contaierStyle: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                    itemStyle: "flex w-full",
                  },
                  render: (row: UserVerificationType) => (
                    <div className="w-full bg-white rounded-md flex flex-col gap-6 justify-between">
                      <div className="flex flex-col gap-2 border p-6 rounded-md">
                        <div className="flex justify-between">
                          <div className="font-bold text-gray-900">
                            {row.verification?.name}
                          </div>
                          {row.status === true && (
                            <CheckBadgeIcon className="text-green-900 w-5" />
                          )}
                          {row.status === null && (
                            <ClockIcon className="text-orange-900 w-5" />
                          )}
                          {row.status === false && (
                            <XCircleIcon className="text-red-900 w-5" />
                          )}
                        </div>

                        <div className="text-xs">{row.user.name}</div>

                        <div className="flex gap-4">
                          {row.uploads.map((upload, index) => (
                            <div key={index}>
                              <Link href={upload} target="_blank" className="">
                                <DocumentIcon className="w-6" />{" "}
                                {row.verification.requiredDocs[index]}
                              </Link>
                            </div>
                          ))}
                        </div>
                        {row.requestChanges && (
                          <div className="text-xs text-orange-500">
                            Requested: {row.requestChanges}
                          </div>
                        )}
                        <div className=" mt-6 flex justify-center gap-3 items-center">
                          {row.status !== true && (
                            <>
                              {!approveMutation.isPending && (
                                <>
                                  <CustomButton
                                    color="bg-blue-100 bg-opacity-10"
                                    className="flex gap-2 text-gray-500 cursor-pointer px-3"
                                    onClick={() => {
                                      setType("request");
                                      setSelectedVerification(row);
                                      setFormOpened(true);
                                    }}
                                  >
                                    Changes
                                  </CustomButton>

                                  <CustomButton
                                    color="bg-red-100 bg-opacity-10"
                                    className="flex gap-2 text-red-500 cursor-pointer px-3"
                                    onClick={() => {
                                      setType("reject");
                                      setSelectedVerification(row);
                                      setFormOpened(true);
                                    }}
                                  >
                                    Reject
                                  </CustomButton>
                                </>
                              )}

                              <CustomButton
                                color="bg-green-100 bg-opacity-10"
                                isLoading={
                                  approveMutation.isPending &&
                                  approveVerification == row.id.toString()
                                }
                                className="flex gap-2 text-green-500 cursor-pointer px-3"
                                onClick={() => {
                                  setApproveVerification(row.id.toString());
                                  approveMutation.mutate(row.id.toString());
                                }}
                              >
                                {approveMutation.isPending
                                  ? "Approving ..."
                                  : "Approve"}
                              </CustomButton>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {formOpened && (
        <Modal
          title={`${
            type == "reject" ? "Reject" : "Request changes on "
          } verification`}
          onClose={() => setFormOpened(false)}
          isOpen={formOpened}
        >
          <Form
            closeModal={() => setFormOpened(false)}
            verification={selectedVerification}
            setVerification={() => {
              setSelectedVerification(undefined);
            }}
            type={type}
          />
        </Modal>
      )}
    </div>
  );
};

type FormProps = {
  closeModal: () => void;
  verification?: UserVerification;
  setVerification: () => void;
  type: string;
};

const Form: FC<FormProps> = ({ closeModal, verification, type }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ requestChanges: string | null; reason: string | null }>();

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.put(`/verifications/update`, data);
      return res;
    },
    onSuccess: () => {
      toast.success("Verification updated");
      queryClient.invalidateQueries({ queryKey: ["pending_verifications"] });
      closeModal();
    },
  });

  const submit = async (data: FieldValues) => {
    let requestChanges = null,
      reason = null;
    if (data.requestChanges && data.requestChanges.length > 0) {
      requestChanges = data.requestChanges;
    }
    if (data.reason && data.reason.length > 0) {
      reason = data.reason;
    }
    const requestData = {
      id: verification?.id,
      changed: false,
      status: type == "reject" ? false : null,
      reason: reason,
      requestChanges: requestChanges,
    };
    updateMutation.mutate({ ...requestData });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      autoComplete="off"
      className="space-y-4 flex flex-col"
    >
      {type === "request" && (
        <TextArea
          label="Changes"
          register={register("requestChanges")}
          rows={2}
          error={errors.requestChanges?.message}
        />
      )}

      {type === "reject" && (
        <Field
          label="Reason"
          register={register("reason")}
          error={errors.reason?.message}
          type="text"
        />
      )}

      <CustomButton
        isLoading={updateMutation.isPending}
        label="Submit"
        type="submit"
      />
    </form>
  );
};

export default PendingVerificationsTab;
