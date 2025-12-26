"use client";

import { useState, useEffect } from "react";
import {
  MdPersonAdd,
  MdAssignment,
  MdWarning,
  MdCheckCircle,
  MdNotifications,
  MdLocalHospital,
  MdSchedule,
  MdError,
  MdInfo,
  MdSecurity,
  MdMessage,
  MdPerson,
  MdInventory,
  MdUpdate,
  MdEvent,
  MdPayment,
  MdReport,
  MdVerified,
  MdCancel,
  MdPending,
  MdApproval,
  MdBiotech,
  MdScience,
  MdMedicalServices,
} from "react-icons/md";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function AlertsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_END_POINT}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "doctor_request":
        return {
          icon: MdPersonAdd,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        };
      case "donor_allotted":
        return {
          icon: MdPerson,
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "document_uploaded":
        return {
          icon: MdAssignment,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        };
      case "process_completed":
        return {
          icon: MdCheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "appointment_scheduled":
        return {
          icon: MdSchedule,
          color: "text-indigo-600",
          bgColor: "bg-indigo-100",
        };
      case "medical_alert":
        return {
          icon: MdLocalHospital,
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      case "security_alert":
        return {
          icon: MdSecurity,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        };
      case "message":
        return {
          icon: MdMessage,
          color: "text-pink-600",
          bgColor: "bg-pink-100",
        };
      case "info":
        return { icon: MdInfo, color: "text-blue-600", bgColor: "bg-blue-100" };
      case "error":
        return { icon: MdError, color: "text-red-600", bgColor: "bg-red-100" };
      case "payment_received":
        return {
          icon: MdPayment,
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "report_generated":
        return {
          icon: MdReport,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        };
      case "verification_complete":
        return {
          icon: MdVerified,
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "request_cancelled":
        return { icon: MdCancel, color: "text-red-600", bgColor: "bg-red-100" };
      case "pending_approval":
        return {
          icon: MdPending,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        };
      case "approval_granted":
        return {
          icon: MdApproval,
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "lab_result":
        return {
          icon: MdBiotech,
          color: "text-cyan-600",
          bgColor: "bg-cyan-100",
        };
      case "test_scheduled":
        return {
          icon: MdScience,
          color: "text-indigo-600",
          bgColor: "bg-indigo-100",
        };
      case "medical_update":
        return {
          icon: MdMedicalServices,
          color: "text-teal-600",
          bgColor: "bg-teal-100",
        };
      case "system_update":
        return {
          icon: MdUpdate,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };
      case "event_reminder":
        return {
          icon: MdEvent,
          color: "text-violet-600",
          bgColor: "bg-violet-100",
        };
      case "inventory_alert":
        return {
          icon: MdInventory,
          color: "text-amber-600",
          bgColor: "bg-amber-100",
        };
      case "donor_registration":
        return {
          icon: MdPersonAdd,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        };
      case "donor_screening":
        return {
          icon: MdMedicalServices,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        };
      case "sample_collection":
        return {
          icon: MdScience,
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "storage_update":
        return {
          icon: MdInventory,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        };
      default:
        return {
          icon: MdNotifications,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#402575]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Fixed Header */}
      <div
        className="sticky top-0 z-10 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm"
        style={{ padding: "17px 14px 15px 15px" }}
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Alerts & Notifications
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden bg-gray-50">
        <div className="w-full overflow-hidden">
          <div className="h-full overflow-auto p-4">
            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                  <MdNotifications className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-lg text-gray-500">
                    No notifications found
                  </p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const iconData = getNotificationIcon(notification.type);
                  const Icon = iconData.icon;
                  return (
                    <div
                      key={notification._id}
                      className={`rounded-xl border border-gray-100 bg-gray-50 p-3 shadow-sm transition-all hover:shadow-md ${
                        !notification.isRead
                          ? "bg-gray-100 ring-2 ring-gray-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`rounded-full p-2 ${iconData.bgColor} flex-shrink-0`}
                        >
                          <Icon className={`h-5 w-5 ${iconData.color}`} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {dayjs(notification.createdAt).fromNow()}
                              </span>
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-gray-600">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
