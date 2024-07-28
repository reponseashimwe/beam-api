import React, { FC, ReactNode, useEffect, useRef } from "react";
import { Transition, TransitionChild } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/solid";

interface IDrawerProps {
  open: boolean;
  DrawerContent: ReactNode;
  large?: boolean;
  closeDrawer?: () => void;
  title?: string;
}

const Drawer: FC<IDrawerProps> = ({ open, DrawerContent, large, closeDrawer, title }) => {
  const width = large ? "w-full max-w-[700px]" : "w-full max-w-[500px]";
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
      closeDrawer?.();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const renderDrawerContent = () => {
    if (React.isValidElement(DrawerContent)) {
      const Component = DrawerContent.type as React.ComponentType<unknown>;
      return <Component closeDrawer={closeDrawer} {...DrawerContent.props} />;
    } else {
      return DrawerContent;
    }
  };

  return (
    <div className="relative">
      <Transition show={open} as={React.Fragment}>
        <div className="fixed inset-0 overflow-hidden z-50">
          <TransitionChild
            as={React.Fragment}
            leaveTo="opacity-0"
            enterTo="opacity-100"
            enterFrom="opacity-0"
            leaveFrom="opacity-100"
            enter="transition-opacity duration-300"
            leave="transition-opacity duration-300"
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </TransitionChild>
          <TransitionChild
            as={React.Fragment}
            enterTo="translate-x-0"
            leaveTo="translate-x-full"
            leaveFrom="translate-x-0"
            enterFrom="translate-x-full"
            enter="transition-transform duration-300"
            leave="transition-transform duration-300"
          >
            <div
              ref={drawerRef}
              className={`absolute max-w-[700px] h-full flex flex-col w-full inset-y-0 right-0 ${width} overflow-auto bg-white shadow-lg p-6`}
            >
              <div className="flex gap-4 items-center mb-6">
                <XCircleIcon
                  onClick={closeDrawer}
                  title="Close"
                  className="w-8 p-1 cursor-pointer hover:text-darkblue text-darkblue"
                />
                <div className="font-bold text-lg text-gray-900">{title}</div>
              </div>
              <div className="px-3 h-full">{renderDrawerContent()}</div>
            </div>
          </TransitionChild>
        </div>
      </Transition>
    </div>
  );
};

export default Drawer;
