"use client";

import { useState } from "react";
import { MdNotifications, MdWarning, MdInfo, MdError, MdCheckCircle } from "react-icons/md";

export default function AlertsPage() {
  const [alertsByDate] = useState({
    "Today": [
      {
        id: 1,
        type: "warning",
        title: "Blood Report Pending",
        message: "5 donors have pending blood reports that need to be uploaded",
        time: "2:30 PM",
        read: false,
      },
      {
        id: 2,
        type: "error",
        title: "Document Missing",
        message: "Consent form missing for donor ID: DON-2024-001",
        time: "11:45 AM",
        read: false,
      },
      {
        id: 3,
        type: "info",
        title: "New Donor Registration",
        message: "3 new donors registered today",
        time: "9:15 AM",
        read: true,
      },
    ],
    "Yesterday": [
      {
        id: 4,
        type: "success",
        title: "Storage Updated",
        message: "Semen storage inventory has been updated successfully",
        time: "4:20 PM",
        read: true,
      },
      {
        id: 5,
        type: "warning",
        title: "Appointment Reminder",
        message: "10 donors have appointments scheduled for tomorrow",
        time: "2:10 PM",
        read: false,
      },
    ],
    "2 days ago": [
      {
        id: 6,
        type: "info",
        title: "System Maintenance",
        message: "Scheduled maintenance completed successfully",
        time: "6:00 PM",
        read: true,
      },
    ],
  });

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
        return <MdWarning className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <MdError className="h-4 w-4 text-red-500" />;
      case "info":
        return <MdInfo className="h-4 w-4 text-blue-500" />;
      case "success":
        return <MdCheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <MdNotifications className="h-4 w-4 text-gray-500" />;
    }
  };

  const totalUnread = Object.values(alertsByDate)
    .flat()
    .filter(alert => !alert.read).length;

  return (
    <div className="flex h-screen flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 flex-shrink-0 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Alerts & Notifications
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {totalUnread} unread
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-auto p-4">
          {Object.entries(alertsByDate).map(([date, alerts]) => (
            <div key={date} className="mb-6">
              {/* Date Header */}
              <div className="mb-4 flex items-center">
                <h2 className="text-sm font-semibold text-gray-900">{date}</h2>
                <div className="ml-3 h-px flex-1 bg-gray-200"></div>
              </div>
              
              {/* Alerts for this date */}
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                      !alert.read ? "border-l-4 border-l-blue-500" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`text-sm font-medium ${!alert.read ? "text-gray-900" : "text-gray-700"}`}>
                              {alert.title}
                            </h3>
                            <p className={`mt-1 text-sm ${!alert.read ? "text-gray-700" : "text-gray-600"}`}>
                              {alert.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{alert.time}</span>
                            {!alert.read && (
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {Object.keys(alertsByDate).length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-md">
              <MdNotifications className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No alerts</h3>
              <p className="mt-2 text-gray-500">You're all caught up! No new alerts at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}