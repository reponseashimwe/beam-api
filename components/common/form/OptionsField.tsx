import { FC, ReactNode, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
interface IOptionFielOption {
  value: string;
  label: string;
  disabled?: boolean;
  selected?: boolean;
}
interface IOptionsField {
  label?: string;
  register?: UseFormRegisterReturn;
  error?: string;
  options?: IOptionFielOption[];
  defaultValue?: string;
  margin?: boolean;
  required?: boolean;
  defaultLabel?: string;
  additionalClass?: string;
  onChange?: (value: string) => void;
  onValueChage?: (value: string) => void;
  setValue?: (params: string) => void;
  icon?: ReactNode;
}
const OptionsField: FC<IOptionsField> = ({
  label,
  options,
  register,
  error,
  defaultValue,
  required = true,
  margin = true,
  additionalClass = "",
  defaultLabel,
  setValue,
  onChange,
  onValueChage,
  icon,
}) => {
  useEffect(() => {
    if (defaultValue?.trim()) {
      setValue && setValue(defaultValue);
    }
  }, [defaultValue, setValue]);
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className={`${margin ? "mt-1" : ""} w-full relative`}>
        {icon && (
          <div className="absolute h-full flex items-center px-2.5 text-gray-600">
            {icon}
          </div>
        )}
        <select
          {...register}
          onChange={(e) => {
            onValueChage && onValueChage(e.target.value);
            onChange && onChange(e.target.value);
          }}
          defaultValue={defaultValue}
          className={` ${additionalClass}  font-inherit  block w-full rounded-lg border-0 py-2 ${
            icon ? "pr-5 pl-10" : "px-5"
          }  text-gray-900 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset ${
            error
              ? `focus:ring-red-500 ring-red-300 placeholder:text-red-400`
              : `focus:ring-primary ring-gray-300 placeholder:text-gray-400`
          }  sm:text-sm sm:leading-6 outline-none`}
        >
          {!required && (
            <option value={""}>
              {defaultLabel ? defaultLabel : "Select one"}
            </option>
          )}
          {options?.map((option) => (
            <option
              disabled={option.disabled}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <label className="block text-sm leading-6 text-red-500">{error}</label>
      </div>
    </div>
  );
};
export default OptionsField;
