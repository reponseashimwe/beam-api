import { FC, ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface IField {
  label?: string;
  type: string;
  register?: UseFormRegisterReturn;
  error?: string;
  value?: string;
  margin?: boolean;
  allowFloats?: boolean;
  disabled?: boolean;
  onValueChage?: (value: string) => void;
  additionalClass?: string;
  name?: string;
  placeholder?: string;
  icon?: ReactNode;
}
const Field: FC<IField> = ({
  label,
  type,
  register,
  error,
  value = "",
  disabled = false,
  margin = true,
  allowFloats = true,
  onValueChage,
  additionalClass = "",
  placeholder = "",
  icon,
  ...props
}) => {
  return (
    <div className="block w-full">
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900p">
          {label}
        </label>
      )}
      <div className={`${margin ? "mt-1" : ""} w-full relative`}>
        {icon && (
          <div className="absolute h-full flex items-center px-2.5 text-gray-600">
            {icon}
          </div>
        )}

        <input
          {...register}
          {...props}
          type={type}
          placeholder={placeholder}
          defaultValue={value}
          onChange={(e) => onValueChage && onValueChage(e.target.value)}
          className={`${additionalClass}  font-inherit  block w-full rounded-lg border-0 py-2 ${
            icon || type == "date" ? "pl-10 pr-5" : "px-5"
          } text-gray-900 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset ${
            error
              ? `focus:ring-red-500 ring-red-300`
              : `focus:ring-primary ring-gray-300 placeholder:text-gray-400`
          }  sm:text-sm sm:leading-6 outline-none`}
          {...(disabled ? { disabled: true } : {})}
          {...(allowFloats ? { step: 0.01 } : {})}
        />

        <label className="block text-sm leading-6 text-red-500">{error}</label>
      </div>
    </div>
  );
};
export default Field;
