"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCurrentUser, getRoleDisplayName } from "@/utils/roleUtils";
import {
  MdDashboard,
  MdPersonAdd,
  MdFolder,
  MdHistory,
  MdStorage,
  MdNotifications,
} from "react-icons/md";

/**
 * ReceptionistDashboard - Dashboard for receptionist role
 * Features card-based navigation matching the provided design
 */
export default function ReceptionistDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Get user data
    const userData = getCurrentUser();
    setUser(userData);

    // Update time
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setCurrentTime(`${timeStr} | ${dateStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/auth/sign-in");
  };

  const actionCards = [
    {
      title: "Dashboard",
      description:
        "Stay updated on donor assignments, medical reports, and pending actions",
      icon: MdDashboard,
      href: "/home",
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Add New Donor",
      description: "Initiate donor requirement (non-payment)",
      icon: MdPersonAdd,
      href: "/donors/add",
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Donor Cases",
      description: "Handle calls or updates for patient follow-up",
      icon: MdFolder,
      href: "/donors/active",
      color: "bg-pink-50 dark:bg-pink-900/20",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
    {
      title: "Donors History",
      description: "Track who has been assigned for screening or treatment",
      icon: MdHistory,
      href: "/donors/history",
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Semen Management",
      description: "Manage patient calls and follow-up updates with ease",
      icon: MdStorage,
      href: "/storage",
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Notifications",
      description: "Initiate donor requirement (non-payment/named)",
      icon: MdNotifications,
      href: "/notifications",
      color: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* User Profile Card */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <Image
              src="/images/user/user-03.png"
              alt={user.fullName}
              width={120}
              height={120}
              className="rounded-full border-4 border-white shadow-lg dark:border-gray-700"
            />
            <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-4 border-white bg-green-500 dark:border-gray-700"></div>
          </div>

          <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
            {user.fullName}
          </h1>
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Emp ID: {user.id?.slice(-6) || "N/A"} |{" "}
            {getRoleDisplayName(user.role)}
          </p>

          {/* Time Display */}
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md dark:bg-gray-800">
            <svg
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentTime}
            </span>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {actionCards.map((card, index) => (
            <button
              key={index}
              onClick={() => router.push(card.href)}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
            >
              <div className={`mb-4 inline-flex rounded-xl p-3 ${card.color}`}>
                <card.icon className={`h-8 w-8 ${card.iconColor}`} />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {card.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {card.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 group-hover:w-full"></div>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-rose-600 hover:shadow-xl"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
