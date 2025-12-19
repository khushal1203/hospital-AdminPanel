"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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

export default function TopNavigation() {
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setRole(getUserRole());
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
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

        // Doctor/Admin और Receptionist के लिए
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
        <nav className="sticky top-0 z-[10000] bg-gradient-to-r from-[#5B4B8A] to-[#6B5B9A] shadow-lg">
            <div className="mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
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

                        {/* Navigation Items */}
                        <div className="hidden items-center gap-1 md:flex">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${isActive(item.href)
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Side - Add User, Notifications & User */}
                    <div className="flex items-center gap-4">
                        {/* Add New Donor Button */}
                        {/* <Link
                            href="/donors/add"
                            className="flex items-center gap-2 rounded-lg bg-pink-500/20 px-4 py-2 text-sm font-medium text-white ring-1 ring-pink-500/50 transition hover:bg-pink-500/30"
                        >
                            <MdPersonAdd className="h-5 w-5" />
                            <span className="hidden md:block">Add New Donor</span>
                        </Link> */}



                        {/* Notifications */}
                        <button className="relative rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
                            <MdNotifications className="h-6 w-6" />
                            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-pink-500"></span>
                        </button>

                        {/* User Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-white transition hover:bg-white/10"
                            >
                                <Image
                                    src="/images/user/user-03.png"
                                    alt="User"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                                <span className="hidden text-sm font-medium md:block">{user?.fullName || "User"}</span>
                                <svg
                                    className={`h-4 w-4 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-xl">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/pages/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </Link>
                                    {/* User Management - सिर्फ Doctor/Admin को दिखेगा */}
                                    {(role === ROLES.DOCTOR || role === ROLES.ADMIN) && (
                                        <Link
                                            href="/users"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            User Management
                                        </Link>
                                    )}
                                    <hr className="my-2" />
                                    <button
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.href = "/auth/sign-in";
                                        }}
                                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
