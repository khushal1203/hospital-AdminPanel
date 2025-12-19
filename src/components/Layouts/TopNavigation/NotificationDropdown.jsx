"use client";

import { useState, useRef, useEffect } from "react";
import { MdNotifications, MdPersonAdd, MdAssignment, MdCheckCircle, MdWarning } from "react-icons/md";
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
            isRead: false
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
            isRead: false
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
            isRead: true
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
            isRead: true
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
            isRead: true
        }
    ];

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-full p-2 text-white/80 transition-all duration-200 hover:bg-white/15 hover:text-white hover:scale-105"
            >
                <MdNotifications className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-pink-500 text-xs font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-3 w-96 rounded-xl bg-white shadow-2xl ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200 z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                        {notifications.map((notification) => {
                            const Icon = notification.icon;
                            return (
                                <div 
                                    key={notification.id}
                                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                                        !notification.isRead ? 'bg-blue-50/50' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${notification.bgColor} flex-shrink-0`}>
                                            <Icon className={`h-4 w-4 ${notification.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {notification.title}
                                                </p>
                                                {!notification.isRead && (
                                                    <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {notification.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-gray-100">
                        <button className="w-full text-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}