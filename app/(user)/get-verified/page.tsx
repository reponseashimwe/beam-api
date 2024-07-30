"use client";

import CustomButton from "@/components/common/form/Button";
import Modal from "@/components/common/Modal";
import Status from "@/components/common/Status";
import Table from "@/components/table/Table";
import apiClient from "@/lib/axiosInstance";
import {
  getUserVerifications,
  getVerifications,
} from "@/lib/queries/verifications";
import { UserVerification, Verification } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import FileInput from "@/components/common/form/FileInput";
import ComboboxField from "@/components/common/form/ComboboxField";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/20/solid";
import {
  ClockIcon,
  DocumentIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface UserVerificationType extends UserVerification {
  verification: Verification;
}

const Verifications = () => {
  const [formOpened, setFormOpened] = useState(false);
  const [deletionVerification, setDeletionVerification] = useState<string>();
  const [remainingVerifications, setRemainingVerifications] =
    useState<Verification[]>();
  const [selectedVerification, setSelectedVerification] =
    useState<Verification>();

  const [updateVerification, setUpdateVerification] = useState<string>();

  const { data: userVerifications, isLoading } = useQuery({
    queryFn: getUserVerifications,
    queryKey: ["user_verifications"],
  });

  const { data: verifications } = useQuery({
    queryFn: getVerifications,
    queryKey: ["verifications"],
  });

  useEffect(() => {
    if (
      verifications &&
      userVerifications &&
      remainingVerifications == undefined
    ) {
      const vIds = userVerifications.map((v) => v.verificationId);
      const rem = verifications.filter((v) => !vIds.includes(v.id));
      setRemainingVerifications(rem);
    }
  }, [verifications, userVerifications]);

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/verifications/delete?id=${id}`);
      return res;
    },
    onSuccess: () => {
      toast.success("Verification deleted");
      queryClient.invalidateQueries({ queryKey: ["user_verifications"] });
      setRemainingVerifications(undefined);
      setDeletionVerification(undefined);
    },
  });

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center gap-5">
        <div className="text-lg font-bold">My verifications</div>
        <div>
          <CustomButton
            label="New Verification"
            onClick={() => setFormOpened(true)}
          />
        </div>
      </div>
      <div className="pt-6">
        <div
          className={`flex gap-6 ${
            userVerifications && userVerifications.length == 0
              ? "flex-col"
              : "flex-col lg:flex-row"
          }`}
        >
          <div className="w-full">
            {isLoading && !userVerifications && (
              <p className="py-6">Loading...</p>
            )}
            {userVerifications && userVerifications.length > 0 && (
              <div>
                <Table
                  isLoading={isLoading}
                  data={userVerifications || []}
                  columns={{
                    styles: {
                      contaierStyle: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6",
                      itemStyle: "flex w-full",
                    },
                    render: (row: UserVerificationType) => (
                      <div className="w-full bg-whiterounded-md flex flex-col gap-6 justify-between">
                        <div className="flex flex-col gap-4 border p-6 rounded-md">
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

                          <div className="text-xs">
                            {row.verification.description}
                          </div>
                          {row.status !== true && (
                            <div className="flex gap-4">
                              {row.uploads.map((upload, index) => (
                                <div key={index}>
                                  <Link
                                    href={upload}
                                    target="_blank"
                                    className="text-xs"
                                  >
                                    <DocumentIcon className="w-6" />{" "}
                                    {row.verification.requiredDocs[index]}
                                  </Link>
                                </div>
                              ))}
                            </div>
                          )}
                          {row.requestChanges && (
                            <div className="text-xs text-orange-500">
                              Comment: {row.requestChanges}
                            </div>
                          )}
                          {row.reason && (
                            <div className="text-xs text-orange-500">
                              Reason: {row.reason}
                            </div>
                          )}
                          <div className=" mt-2 flex justify-between items-center">
                            <div>
                              {(row.status === true ||
                                row.status === false) && (
                                <Status status={row.status} />
                              )}
                              {row.status === null && (
                                <Status
                                  status={row.requestChanges ? true : null}
                                  trueText="Changes requested"
                                  falseText="Disapproved"
                                />
                              )}
                            </div>

                            <div className="flex gap-2 items-center">
                              {row.status === null && (
                                <CustomButton
                                  color="bg-green-100 bg-opacity-10"
                                  onClick={() => {
                                    setUpdateVerification(row.id.toString());
                                    setSelectedVerification(row.verification);
                                    setFormOpened(true);
                                  }}
                                >
                                  <PencilIcon className="w-5 text-green-500 cursor-pointer" />
                                </CustomButton>
                              )}

                              {!deleteMutation.isPending && (
                                <CustomButton
                                  color="bg-red-100 bg-opacity-10"
                                  onClick={() => {
                                    setDeletionVerification(row.id.toString());
                                    deleteMutation.mutate(row.id.toString());
                                  }}
                                  isLoading={
                                    deleteMutation.isPending &&
                                    deletionVerification === row.id.toString()
                                  }
                                >
                                  <TrashIcon className="w-5 text-red-500 cursor-pointer" />
                                </CustomButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  }}
                />
              </div>
            )}
          </div>
          {remainingVerifications && (
            <div
              className={`w-full ${
                userVerifications?.length == 0
                  ? "max-w-full"
                  : "lg:max-w-[300px] bg-gray-50 p-8 sticky top-0"
              } rounded-md`}
            >
              <div className="font-bold text-md mb-6">
                Recommended verifications
              </div>
              <div
                className={`grid gap-6 grid sm:grid-cols-2 md:grid-cols-3  ${
                  userVerifications?.length == 0
                    ? "lg:grid-cols-4"
                    : "lg:grid-cols-1"
                }`}
              >
                {remainingVerifications?.map((verification) => (
                  <div
                    className={`w-full border rounded-md p-6`}
                    key={verification.id}
                  >
                    <div className="font-medium">{verification.name}</div>
                    <div className="text-xs">{verification.description}</div>
                    <CustomButton
                      label="Get verified"
                      onClick={() => {
                        setSelectedVerification(verification);
                        setFormOpened(true);
                      }}
                      color="bg-transparent text-gray-900"
                      className="underline shadow-none px-0 hover:shadow-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {formOpened && (
        <Modal
          title={`${updateVerification ? "Update" : "New"} Verification`}
          onClose={() => {
            setFormOpened(false);
            setSelectedVerification(undefined);
            setUpdateVerification(undefined);
          }}
          isOpen={formOpened}
        >
          <Form
            closeModal={() => {
              setFormOpened(false);
              setSelectedVerification(undefined);
              setUpdateVerification(undefined);
            }}
            verifications={verifications || []}
            verification={selectedVerification}
            update={updateVerification}
          />
        </Modal>
      )}
    </div>
  );
};

type FormProps = {
  closeModal: () => void;
  verifications: Verification[];
  verification?: Verification;
  update?: string;
};

const Form: FC<FormProps> = ({
  closeModal,
  verifications,
  verification,
  update,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>();

  const [selectedVerification, setSelectedVerification] = useState<string>(
    verification?.id.toString() || ""
  );
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post(`/verifications/request`, data);
      return res;
    },
    onSuccess: () => {
      toast.success("Verification request created");
      queryClient.invalidateQueries({ queryKey: ["user_verifications"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.put(`/verifications/update`, data);
      return res;
    },
    onSuccess: () => {
      toast.success("Verification request updated");
      queryClient.invalidateQueries({ queryKey: ["user_verifications"] });
      closeModal();
    },
  });

  const handleUpload = async (data: FieldValues) => {
    setUploading(true);
    try {
      const uploadUrls: string[] = [];
      const requiredDocs =
        verifications.find((v) => v.id.toString() === selectedVerification)
          ?.requiredDocs || [];

      for (const doc of requiredDocs) {
        if (data[doc]?.length) {
          const formData = new FormData();
          formData.append("file", data[doc][0]);
          formData.append("upload_preset", "online");

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/dxeepn9qa/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const result = await response.json();
          uploadUrls.push(result.secure_url);
        }
      }

      let requestData: any = {
        verificationId: verifications.find(
          (v) => v.id.toString() === selectedVerification
        )?.id,
        uploads: uploadUrls,
      };

      if (update) {
        requestData = {
          ...requestData,
          id: update,
          changed: true,
          status: null,
          reason: null,
          requestChanges: null,
        };
        updateMutation.mutate({ ...requestData });
      } else {
        mutation.mutate({ ...requestData });
      }
    } catch (error) {
      toast.error("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpload)}
      autoComplete="off"
      className="space-y-4 flex flex-col"
    >
      <div className={`${update ? "hidden" : ""}`}>
        <ComboboxField
          label="Verification"
          options={verifications.map((verification) => ({
            value: verification.id.toString(),
            label: verification.name,
          }))}
          defaultValue={verification?.id.toString()}
          onChange={(value: string) => {
            setValue("verificationId", value);
            setSelectedVerification(value);
          }}
          error={errors.verificationId?.message as string}
        />
      </div>
      {selectedVerification &&
        verifications
          .filter((v) => v.isAutoApproved === false)
          .find((v) => v.id.toString() === selectedVerification)
          ?.requiredDocs.map((doc, index) => (
            <FileInput
              key={index}
              label={doc}
              register={register(doc, { required: `${doc} is required` })}
              error={errors[doc]?.message as string}
            />
          ))}
      <CustomButton
        isLoading={uploading || mutation.isPending || updateMutation.isPending}
        label="Submit"
        type="submit"
      />
    </form>
  );
};

export default Verifications;
