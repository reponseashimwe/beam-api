import { FC, Fragment, ReactNode, useEffect, useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export interface IOptionFieldOption {
  value: string;
  label: string;
}

interface IOptionsField {
  label?: string;
  error?: string;
  options: IOptionFieldOption[];
  margin?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  additionalClass?: string;
  icon?: ReactNode;
}

const ComboboxField: FC<IOptionsField> = ({
  label,
  options,
  error,
  defaultValue,
  margin = true,
  onChange,
  additionalClass = "",
  icon,
  value,
}) => {
  const [selected, setSelected] = useState<IOptionFieldOption | undefined>();
  const [query, setQuery] = useState("");

  const valueChanged = (value: IOptionFieldOption) => {
    if (value == null) {
      onChange && onChange("");
      setSelected(undefined);
    } else {
      const selected = options.find((option) => option.value === value.value);

      setSelected(selected);
      onChange && onChange(value.value);
    }
  };

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option: IOptionFieldOption) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  useEffect(() => {
    if (defaultValue !== undefined) {
      const defaultOption = options.find(
        (option) => option.value === defaultValue
      );
      if (defaultOption) {
        setSelected(defaultOption);
        valueChanged(defaultOption);
      }
    }
  }, [defaultValue]);

  useEffect(() => {
    if (value !== undefined) {
      const defaultOption = options.find((option) => option.value === value);
      if (defaultOption) {
        setSelected(defaultOption);
        valueChanged(defaultOption);
      }
    }
  }, [value]);

  return (
    <div className="block w-full relative">
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className={`${margin ? "mt-2" : ""} w-full relative`}>
        {icon && (
          <div className="absolute h-full flex items-center px-2.5 text-gray-800">
            {icon}
          </div>
        )}
        <Combobox value={selected} onChange={valueChanged}>
          <div className="relative mt-1">
            <div
              className={`block w-full rounded-xl border-0 py-1.5 px-5 text-gray-900 shadow-sm ring-1 ring-inset ${
                error
                  ? `focus:ring-red-500 ring-red-300 placeholder:text-red-400`
                  : `focus:ring-primary ring-gray-300 placeholder:text-gray-400`
              }  sm:text-sm sm:leading-6 outline-none`}
            >
              <ComboboxInput
                className={` ${additionalClass} w-full border-none py-1.5 ${
                  icon ? "pl-4" : "pl-1.5"
                } pr-3 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none bg-transparent`}
                displayValue={(option: IOptionFieldOption) => option?.label}
                onChange={(event) => setQuery(event.target.value)}
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </ComboboxButton>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <ComboboxOptions
                className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 10,
                }}
              >
                {filteredOptions.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-700 bg-white">
                    Nothing found.
                  </div>
                ) : (
                  filteredOptions.map((option: IOptionFieldOption) => (
                    <ComboboxOption
                      key={option.value}
                      className={({ active }) =>
                        `${
                          option.value == "" ? "hidden" : "block"
                        } relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-primary text-white"
                            : "bg-white text-gray-900"
                        }`
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            title={option.label}
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {option.label}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-blue"
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </Transition>
          </div>
        </Combobox>
        <label className="block text-sm leading-6 text-red-500">{error}</label>
      </div>
    </div>
  );
};

export default ComboboxField;
