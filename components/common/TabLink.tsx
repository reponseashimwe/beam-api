import { FC, ReactElement } from "react";
import { Fragment } from "react";
import { Tab } from "@headlessui/react";

type TabLinkProps = {
  label?: string;
  icon?: ReactElement;
};

const TabLink: FC<TabLinkProps> = ({ label, icon }) => {
  return (
    <>
      <Tab as={Fragment}>
        {({ selected }) => (
          <button
            className={`inline-flex h-full gap-2 py-1.5 px-4 mr-2 border-transparent border-2 font-medium outline-none ${
              selected ? "text-blue border-b-blue" : ""
            }`}
          >
            {icon}
            {label}
          </button>
        )}
      </Tab>
    </>
  );
};

export default TabLink;
