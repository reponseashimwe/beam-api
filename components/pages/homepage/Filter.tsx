import Button from "@/components/common/form/Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Field from "@/components/common/form/Field";
import ComboboxField from "@/components/common/form/ComboboxField";
import OptionsField from "@/components/common/form/OptionsField";
import {
  CheckBadgeIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVerifications } from "@/lib/queries/verifications";
import { getCategories } from "@/lib/queries/categories";
import { Category, Verification } from "@prisma/client";
import { format } from "date-fns";
import apiClient from "@/lib/axiosInstance";
import { Event } from "@prisma/client";

type IFilterRequest = {
  categoryId: string;
  date: string;
  verificationId: string;
  type: string;
};

type props = {
  defaultValues: IFilterRequest;
  setData: Dispatch<SetStateAction<Event[] | undefined>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  defaultLoaded: boolean;
  showFilters: boolean;
  setDefaultLoaded?: Dispatch<SetStateAction<boolean>>;
};

const Filter: FC<props> = ({
  defaultValues,
  setData,
  setLoading,
  defaultLoaded = false,
  setDefaultLoaded,
  showFilters,
}) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: IFilterRequest): Promise<Event[]> => {
      setLoading(true);
      const res = await apiClient.post(`events/filter`, data);
      setLoading(false);

      return res.data;
    },
    onSuccess: (data) => {
      setData && setData(data);
      setLoading && setLoading(false);
      setverification(
        verifications?.find((r) => r.id.toString() == filters?.verificationId)
      );
      setCategory(
        categories?.find((t) => t.id.toString() == filters?.categoryId)
      );
      setType(filters?.type?.length == 0 ? undefined : filters?.type);
      const date =
        filters?.date === undefined ? undefined : new Date(filters.date);

      setDate(filters?.date?.length == 0 ? undefined : date?.toDateString());
    },
    onError: () => {
      setLoading && setLoading(false);
    },
  });

  const [filters, setFilters] = useState<IFilterRequest>();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IFilterRequest>({
    defaultValues: { ...defaultValues },
  });

  const handleFilter = (data: IFilterRequest) => {
    localStorage.setItem("search", JSON.stringify(data));

    setFilters(data);
    setLoading && setLoading(true);
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

  useEffect(() => {
    if (defaultLoaded == false) {
      setLoading && setLoading(true);
      mutation.mutate(defaultValues);
      setFilters(defaultValues);
      setDefaultLoaded && setDefaultLoaded(true);
    }
  });

  const changeKey = (key: string, value: string, filter: boolean = false) => {
    setValue(key as any, value);

    if (filter) {
      const data = { ...getValues(), [key]: value };
      handleFilter(data);
    }
  };

  const [verification, setverification] = useState<Verification>();
  const [category, setCategory] = useState<Category>();
  const [type, setType] = useState<string>();
  const [date, setDate] = useState<string>();

  return (
    <>
      {" "}
      <form
        onSubmit={handleSubmit(handleFilter)}
        className={`w-full rounded-md relative border p-12 content-grid`}
      >
        <div
          className={`grid gap-4 rounded-xl w-full 
              sm:grid-cols-2 lg:grid-cols-4
          bg-white`}
        >
          <div className="grid">
            {verifications && (
              <>
                <ComboboxField
                  icon={<CheckBadgeIcon className="w-5" />}
                  additionalClass=""
                  onChange={(value: string) =>
                    changeKey("verificationId", value)
                  }
                  defaultValue={filters?.verificationId || ""}
                  value={filters?.verificationId || ""}
                  options={[
                    { label: "Verification", value: "" },
                    ...verifications?.map((verification) => {
                      return {
                        value: verification.id.toString(),
                        label: `${verification.name}`,
                      };
                    }),
                  ]}
                  label="Verification"
                />
                {errors.verificationId && (
                  <div className="text-red-500 text-sm">
                    {errors.verificationId.message}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="grid">
            <Field
              additionalClass="h-12"
              onValueChage={(value: string) => changeKey("date", value)}
              type="date"
              label="Date"
              register={register("date")}
              error={errors.date?.message}
            />
          </div>
          <div className={`flex gap-2 w-full`}>
            {categories && (
              <div className="w-full">
                <ComboboxField
                  icon={<FolderIcon className="w-5" />}
                  onChange={(value: string) => changeKey("category", value)}
                  //   additionalClass="h-12"
                  options={[
                    { label: "Select category", value: "" },
                    ...categories?.map((category) => {
                      return {
                        value: category.id.toString(),
                        label: category.name,
                      };
                    }),
                  ]}
                  defaultValue={filters?.categoryId || ""}
                  value={filters?.categoryId || ""}
                  label="Category"
                />
                {errors.type && (
                  <div className="text-red-500 text-sm">
                    {errors.type.message}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`flex gap-2 items-end`}>
            <div className="w-full">
              <OptionsField
                icon={<MapPinIcon className="w-5" />}
                onValueChage={(value: string) => changeKey("type", value)}
                additionalClass="h-12"
                register={register("type")}
                options={[
                  { label: "Select type", value: "" },
                  { label: "Remote", value: "remote" },
                  { label: "Physical", value: "Physical" },
                ]}
                label="Type"
              />
              {errors.type && (
                <div className="text-red-500 text-sm">
                  {errors.type.message}
                </div>
              )}
            </div>
            <Button type="submit" className="sm:col-span-2 rounded">
              <MagnifyingGlassIcon className="w-8" />
            </Button>
          </div>
        </div>
      </form>
      {showFilters && (
        <div className="w-full">
          <ShowFilters
            verification={verification}
            type={type}
            category={category}
            date={date}
            changeKey={changeKey}
          />
        </div>
      )}
    </>
  );
};

type showFiltersProps = {
  verification?: Verification;
  category?: Category;
  type?: string;
  date?: string;
  changeKey: (key: string, value: string, filter: boolean) => void;
};

const ShowFilters: FC<showFiltersProps> = ({
  verification,
  type,
  category,
  date,
  changeKey,
}) => {
  return (
    <div className="flex gap-3 my-6 flex-wrap">
      {verification && (
        <div className="bg-white border text-gray-900 font-medium p-3 rounded flex items-center">
          <div className="text-gray-500 pr-2">Verification</div>{" "}
          {verification.name}{" "}
          <div
            className="text-white pl-5 cursor-pointer"
            onClick={() => changeKey("verificationId", "", true)}
          >
            <XCircleIcon className="w-5 text-red-500" />
          </div>
        </div>
      )}
      {type && (
        <div className="bg-white border text-gray-900 font-medium p-3 rounded flex items-center">
          <div className="text-gray-500 pr-4">Type:</div> {type}
          <div
            className="text-white pl-5 cursor-pointer"
            onClick={() => changeKey("type", "", true)}
          >
            <XCircleIcon className="w-5 text-red-500" />
          </div>
        </div>
      )}
      {category && (
        <div className="bg-white border text-gray-900 font-medium p-3 rounded flex items-center">
          <div className="text-gray-500 pr-4">Category:</div> {category.name}
          <div
            className="text-white pl-5 cursor-pointer"
            onClick={() => changeKey("categoryId", "", true)}
          >
            <XCircleIcon className="w-5 text-red-500" />
          </div>
        </div>
      )}
      {date && (
        <div className="bg-white border text-gray-900 font-medium p-3 rounded flex items-center">
          <div className="text-gray-500 pr-4">Date:</div>{" "}
          {format(new Date(date), "yyyy-MM-dd")}
          <div
            className="text-white pl-5 cursor-pointer"
            onClick={() => changeKey("date", "", true)}
          >
            <XCircleIcon className="w-5 text-red-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
