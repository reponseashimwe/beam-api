import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface ICheckbox {
  label?: string;
  value?: string;
  register?: UseFormRegisterReturn;
  checked?: boolean;
}
const Checkbox: FC<ICheckbox> = ({ label, value, register }) => {
  const uniqueId = `checkbox-${Math.random() * 100}`;

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={uniqueId}
        {...register}
        defaultValue={value}
        className="h-5 w-5 checkbox rounded cursor-pointer"
      />
      {label && (
        <label
          htmlFor={uniqueId}
          className="text-gray-700 cursor-pointer capitalize"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
