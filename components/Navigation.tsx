import Button from "@/components/common/form/Button";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import {
  Bars3BottomRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";
import { FC, Fragment } from "react";

import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
  ChartBarIcon,
  XMarkIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { User } from "@prisma/client";
import Avatar from "@/components/common/Avatar";
import Logo from "@/app/logo";
import { useAuth } from "@/context/AuthContext";
import Links from "./Links";

type props = {
  user: User | null;
};
const Header: FC<props> = ({ user }) => {
  return (
    <header
      className={`content-grid bg-white  z-20 z-10 shadow sticky top-0`}
      // border-b border-active bg-white
    >
      <div className="flex gap-2 items-center justify-between py-3">
        <Link href={"/"} className="flex h-fit">
          <Logo className="h-8 w-fit" color="text-blue" />
        </Link>
        <div className="flex items-center gap-5">
          <nav className="hidden lg:flex gap-12 capitalize">
            <Links user={user} />
          </nav>
          <div className="hidden sm:flex items-center gap-4">
            <Actions user={user} />
          </div>
          <Profile user={user} />
          <div className="h-fit lg:hidden">
            <Popover>
              {({ open }) => (
                <>
                  <PopoverButton className={"outline-none"}>
                    {!open && (
                      <Bars3BottomRightIcon className="text-blue w-6 h-6 outline-none hover:text-indigo-700" />
                    )}
                    {open && (
                      <XMarkIcon className="text-blue w-6 h-6 outline-none hover:text-indigo-700" />
                    )}
                  </PopoverButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-10"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-10"
                  >
                    <PopoverPanel
                      anchor="bottom end"
                      className="flex origin-top flex-col transition duration-400 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 rounded-md shadow-lg px-0 w-[350px] mt-5 max-w-full py-2 bg-white max-w-full z-20"
                    >
                      <div className="flex w-full flex-col p-12 px-8 gap-8">
                        <DropdownLinks user={user} />
                        <div className="sm:hidden">
                          {!user && <Actions user={user} />}
                        </div>
                      </div>
                    </PopoverPanel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

function DropdownLinks({ user }: { user: User | null }) {
  return (
    <div className="w-full flex flex-col">
      <Links user={user} />
    </div>
  );
}

function Actions({ user }: { user: User | null }) {
  if (user == null) {
    return (
      <div className="flex gap-4">
        <Link href={`/sign-in`}>
          <Button
            size="sm"
            className={`bg-primary py-2 font-inherit rounded-md `}
          >
            Log in
          </Button>
        </Link>
        <Link href={"sign-up"} className="sm:hidden">
          <Button
            size="sm"
            variant="outlined"
            className="border-0 outline py-2 -outline-offset-1 font-inherit outline-1 outline-primary text-primary shadow rounded-md"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    );
  } else if (user.isAdmin) {
    return <></>;
  } else {
    return (
      <>
        <Link href={`/events`}>
          <Button
            size="sm"
            className={`bg-primary py-2 font-inherit rounded-md `}
          >
            Add event
          </Button>
        </Link>
      </>
    );
  }
}

const Profile = ({ user }: { user: User | null }) => {
  const { logout } = useAuth();
  if (user != null)
    return (
      <Popover>
        {({ open }) => (
          <>
            <PopoverButton className={"outline-none"}>
              <Avatar user={user} bg="bg-gray-100" />
            </PopoverButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-10"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-10"
            >
              <PopoverPanel
                anchor="bottom end"
                className="flex origin-top flex-col transition duration-400 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 rounded-md shadow-lg px-0 w-[240px] mt-5 max-w-full py-2 bg-white max-w-full z-20"
              >
                <div className="flex w-full flex-col px-8 py-8 gap-6">
                  <Link href={"/profile"} className="flex gap-6">
                    <UserCircleIcon className="text-gray-500 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link href={"/get-verified"} className="flex gap-6">
                    <CheckBadgeIcon className="text-gray-500 w-5" />
                    <span>Verifications</span>
                  </Link>
                  <Link
                    href={"#"}
                    onClick={() => logout()}
                    className="flex gap-6"
                  >
                    <ArrowRightStartOnRectangleIcon className="text-gray-500 w-5" />
                    <span>Sign out</span>
                  </Link>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    );
};
