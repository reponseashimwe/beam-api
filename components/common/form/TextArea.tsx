import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface ITextArea {
  label?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  error?: string;
  value?: string;
  disabled?: boolean;
  onValueChage?: (value: string) => void;
  rows?: number;
}
const TextArea: FC<ITextArea> = ({
  label,
  register,
  error,
  value = "",
  placeholder = "",
  disabled = false,
  onValueChage,
  rows = 5,
}) => {
  return (
    <div className="block min-w-full">
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className="mt-1 min-w-full">
        <textarea
          rows={rows}
          {...register}
          defaultValue={value}
          placeholder={placeholder}
          onChange={(e) => onValueChage && onValueChage(e.target.value)}
          className={` font-inherit  block w-full rounded-lg border-0 py-2 px-5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset ${
            error
              ? `focus:ring-red-500 ring-red-300 placeholder:text-red-400`
              : `focus:ring-primary ring-gray-300 placeholder:text-gray-400`
          }  sm:text-sm sm:leading-6 outline-none`}
          {...(disabled ? { disabled: true } : {})}
        />
        <label className="block text-sm leading-6 text-red-500">{error}</label>
      </div>
    </div>
  );
};
export default TextArea;
