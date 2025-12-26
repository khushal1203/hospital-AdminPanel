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
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function NotificationDropdown() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "doctor_request":
        return { icon: MdPersonAdd, color: "text-blue-600", bgColor: "bg-blue-50" };
      case "donor_allotted":
        return { icon: MdPersonAdd, color: "text-green-600", bgColor: "bg-green-50" };
      case "document_uploaded":
        return { icon: MdAssignment, color: "text-purple-600", bgColor: "bg-purple-50" };
      default:
        return { icon: MdWarning, color: "text-orange-600", bgColor: "bg-orange-50" };
    }
  };

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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => {
                const iconData = getNotificationIcon(notification.type);
                const Icon = iconData.icon;
                return (
                  <div
                    key={notification._id}
                    className={`cursor-pointer border-b border-gray-50 px-4 py-3 transition-colors hover:bg-gray-50 ${
                      !notification.isRead ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-full p-2 ${iconData.bgColor} flex-shrink-0`}
                      >
                        <Icon className={`h-4 w-4 ${iconData.color}`} />
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
                          {dayjs(notification.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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
