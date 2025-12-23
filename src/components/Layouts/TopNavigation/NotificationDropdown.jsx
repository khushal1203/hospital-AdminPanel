"use client";

import { useState, useRef, useEffect } from "react";
import {
  MdNotifications,
  MdPersonAdd,
  MdAssignment,
  MdCheckCircle,
  MdWarning,
} from "react-icons/md";
import dayjs from "dayjs";

export default function NotificationDropdown() {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Static notification data
  const notifications = [
    {
      id: 1,
      type: "donor_allotted",
      title: "Donor Allotted",
      message: "Sarah Johnson has been allotted to Dr. Smith",
      time: "2 minutes ago",
      icon: MdPersonAdd,
      color: "text-green-600",
      bgColor: "bg-green-50",
      isRead: false,
    },
    {
      id: 2,
      type: "document_uploaded",
      title: "Document Uploaded",
      message: "Blood report uploaded for donor Emma Wilson",
      time: "15 minutes ago",
      icon: MdAssignment,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      isRead: false,
    },
    {
      id: 3,
      type: "process_completed",
      title: "OPU Process Completed",
      message: "OPU process completed for donor Lisa Brown",
      time: "1 hour ago",
      icon: MdCheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      isRead: true,
    },
    {
      id: 4,
      type: "consent_pending",
      title: "Consent Form Pending",
      message: "Consent form pending for donor Maria Garcia",
      time: "2 hours ago",
      icon: MdWarning,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      isRead: true,
    },
    {
      id: 5,
      type: "donor_registered",
      title: "New Donor Registered",
      message: "New oocyte donor registered by Dr. Johnson",
      time: "3 hours ago",
      icon: MdPersonAdd,
      color: "text-green-600",
      bgColor: "bg-green-50",
      isRead: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative rounded-full bg-[#281156] p-3 text-white transition-all duration-200 hover:scale-105 hover:bg-[#281156]/80"
      >
        <img
          src="/images/icon/notifiction.svg"
          alt="Notifications"
          className="h-5 w-5"
        />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="animate-in slide-in-from-top-2 absolute right-0 z-50 mt-3 w-96 rounded-xl bg-white shadow-2xl ring-1 ring-black/5 duration-200">
          {/* Header */}
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-600">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="scrollbar-hide max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`cursor-pointer border-b border-gray-50 px-4 py-3 transition-colors hover:bg-gray-50 ${
                    !notification.isRead ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-full p-2 ${notification.bgColor} flex-shrink-0`}
                    >
                      <Icon className={`h-4 w-4 ${notification.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-3">
            <button className="w-full text-center text-sm font-medium text-purple-600 transition-colors hover:text-purple-700">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
