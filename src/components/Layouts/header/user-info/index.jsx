"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [USER, setUSER] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/auth/getUserLocal", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setUSER({
            id: data.user._id, // ✅ ID FIX
            name: data.user.fullName,
            email: data.user.email,
            img: "/images/user/user-03.png",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    setIsOpen(false);

    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    router.push("/auth/sign-in");
  };

  if (!USER) return null;

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="relative">
            <Image
              src={USER.img}
              className="size-10 rounded-full border-2 border-purple-100 object-cover"
              alt={`Avatar of ${USER.name}`}
              width={40}
              height={40}
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <figcaption className="flex items-center gap-2 font-medium text-gray-700 max-[1024px]:sr-only">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{USER.name}</span>
              <span className="text-xs text-gray-500 truncate max-w-[120px]">{USER.email}</span>
            </div>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "w-4 h-4 text-gray-400 rotate-180 transition-transform ml-1",
                isOpen && "rotate-0",
              )}
              strokeWidth={2}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <figure className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="relative">
            <Image
              src={USER.img}
              className="size-12 rounded-full border-2 border-purple-200 object-cover"
              alt={`Avatar for ${USER.name}`}
              width={48}
              height={48}
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <figcaption className="space-y-1">
            <div className="font-semibold text-gray-900 text-base leading-tight">
              {USER.name}
            </div>
            <div className="text-sm text-gray-600 leading-tight">{USER.email}</div>
            <div className="text-xs text-purple-600 font-medium">Online</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <Link
            href={`/profile?id=${USER.id}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 dark:hover:bg-dark-3"
          >
            <UserIcon />
            <span className="mr-auto font-medium">View profile</span>
          </Link>

          <Link
            href={`/pages/settings?id=${USER.id}`} // ✅ ID PASS HERE
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 dark:hover:bg-dark-3"
          >
            <SettingsIcon />
            <span className="mr-auto font-medium">Account Settings</span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 dark:hover:bg-dark-3"
          >
            <LogOutIcon />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
