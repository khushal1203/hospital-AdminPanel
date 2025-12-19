"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    MdHome,
    MdDashboard,
    MdPeople,
    MdHistory,
    MdStorage,
    MdPersonAdd,
    MdNotifications
} from "react-icons/md";
import { getUserRole, ROLES } from "@/utils/roleUtils";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function TopNavigation() {
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [role, setRole] = useState(null);
    const { user } = useCurrentUser();
    const dropdownRef = useRef(null);

    useEffect(() => {
        setRole(getUserRole());
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getNavItems = () => {
        if (role === ROLES.LABORATORY) {
            return [
                { name: "Home", href: "/home", icon: MdHome },
                { name: "Dashboard", href: "/dashboard", icon: MdDashboard },
                { name: "Active Donors", href: "/donors/active", icon: MdPeople },
                { name: "Semen Storage", href: "/donors/semen", icon: MdStorage },
            ];
        }

        return [
            { name: "Home", href: "/home", icon: MdHome },
            { name: "Dashboard", href: "/dashboard", icon: MdDashboard },
            { name: "Active Donors", href: "/donors/active", icon: MdPeople },
            { name: "Donors History", href: "/donors/history", icon: MdHistory },
            { name: "Semen Storage", href: "/donors/semen", icon: MdStorage },
            { name: "Add Donor", href: "/donors/add", icon: MdPersonAdd },
        ];
    };

    const navItems = getNavItems();
    const isActive = (href) => pathname === href;

    return (
        <nav className="sticky top-0 z-[10000] bg-gradient-to-r from-[#5B4B8A] to-[#6B5B9A] shadow-lg border-b border-white/10">
            <div className="mx-auto px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Image
                                src="/images/icon/brand.svg"
                                alt="Logo"
                                width={120}
                                height={32}
                                className=""
                            />
                        </Link>

                        <div className="hidden items-center gap-2 md:flex">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                            isActive(item.href)
                                                ? "bg-white/20 text-white shadow-sm"
                                                : "text-white/80 hover:bg-white/15 hover:text-white hover:shadow-sm"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="whitespace-nowrap">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative rounded-full p-2 text-white/80 transition-all duration-200 hover:bg-white/15 hover:text-white hover:scale-105">
                            <MdNotifications className="h-5 w-5" />
                            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20"
                            >
                                <div className="relative">
                                    <Image
                                        src={user?.profileImage || "/images/user/user-03.png"}
                                        alt="User"
                                        width={32}
                                        height={32}
                                        className="rounded-full ring-2 ring-white/20"
                                        key={user?.profileImage}
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></div>
                                </div>
                                <span className="hidden text-sm font-medium md:block max-w-24 truncate">{user?.fullName || "User"}</span>
                                <svg
                                    className={`h-4 w-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white py-2 shadow-2xl ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName || "User"}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            href="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </Link>
                                        {/* <Link
                                            href="/pages/settings"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </Link> */}
                                        {(role === ROLES.DOCTOR || role === ROLES.ADMIN) && (
                                            <Link
                                                href="/users"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                                User Management
                                            </Link>
                                        )}
                                    </div>
                                    <div className="border-t border-gray-100 py-1">
                                        <button
                                            onClick={() => {
                                                localStorage.clear();
                                                sessionStorage.clear();
                                                window.location.href = "/auth/sign-in";
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                        >
                                            <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}