import { ArrowUpOnSquareIcon, ArrowUpOnSquareStackIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface IFileInput {
  label: string;
  register?: UseFormRegisterReturn;
  error?: string;
  withPreview?: boolean;
  id?: string;
  allowMultiple?: boolean;
}
const FileInput: FC<IFileInput> = ({
  label,
  register,
  error,
  withPreview = false,
  id,
  allowMultiple,
}) => {
  return (
    <>
      {withPreview && (
        <>
          <label
            htmlFor={id}
            className="rounded-md flex flex-col items-center justify-center h-24 w-24 border border-2 my-2"
          >
            {allowMultiple && (
              <ArrowUpOnSquareStackIcon className="text-gray-200 stroke-2 w-8 h-8" />
            )}
            {!allowMultiple && <ArrowUpOnSquareIcon className="text-gray-200 stroke-2 w-8 h-8" />}
            <div className="mt-2 font-medium text-xs text-gray-300">{label}</div>
          </label>
          <input
            {...register}
            type="file"
            id={id}
            className={`hidden`}
            {...(allowMultiple ? { multiple: true } : {})}
          />
        </>
      )}
      {!withPreview && (
        <div className="block w-full">
          <>
            <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="mt-2 min-w-full">
              <input
                {...register}
                type="file"
                id={id}
                // onChange={(e) => onChange && onChange(e.target.files)}
                className={`block min-w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset ${
                  error
                    ? `focus:ring-red-500 ring-red-300 placeholder:text-red-400`
                    : `focus:ring-teal ring-gray-300 placeholder:text-gray-400`
                }  sm:text-sm sm:leading-6 outline-none`}
                {...(allowMultiple ? { multiple: true } : {})}
              />

              <label className="block text-sm leading-6 text-red-500">{error}</label>
            </div>
          </>
        </div>
      )}
    </>
  );
};
export default FileInput;
