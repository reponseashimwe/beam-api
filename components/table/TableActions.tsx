import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { FC, ReactNode } from "react";

interface ActionsProps {
  children: ReactNode;
}

const TableActions: FC<ActionsProps> = ({ children }) => {
  return (
    <Popover>
      <PopoverButton className={"outline-none"}>
        <EllipsisVerticalIcon className="text-primary w-6 h-6 outline-none hover:text-indigo-700" />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom end"
        className="flex origin-top flex-col transition duration-400 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 rounded-md shadow-lg px-0 w-[150px] py-2 bg-white max-w-full"
      >
        {children}
      </PopoverPanel>
    </Popover>
  );
};

export default TableActions;
