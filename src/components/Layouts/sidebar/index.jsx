"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getUserRole, ROLES, isAdmin } from "@/utils/roleUtils";

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
    const pathname = usePathname();
    const [role, setRole] = useState(null);
    const [adminStatus, setAdminStatus] = useState(false);

    useEffect(() => {
        setRole(getUserRole());
        setAdminStatus(isAdmin());
    }, []);

    const getNavItems = () => {
        const baseItems = [
            { name: "Home", href: "/home", icon: "/images/icon/home.svg" },
            { name: "Dashboard", href: "/dashboard", icon: "/images/icon/dashboard.svg" },
        ];

        if (role === ROLES.LABORATORY) {
            return [
                ...baseItems,
                { name: "Active Donors", href: "/donors/active", icon: "/images/icon/activeDonors.svg" },
                { name: "Semen Storage", href: "/donors/semen", icon: "/images/icon/seemansDonor.svg" },
            ];
        }

        const donorItems = [
            { name: "Active Donors", href: "/donors/active", icon: "/images/icon/activeDonors.svg" },
            { name: "Donors History", href: "/donors/history", icon: "/images/icon/donorhistory.svg" },
            { name: "Semen Storage", href: "/donors/semen", icon: "/images/icon/seemansDonor.svg" },
            { name: "Add Donor", href: "/donors/add", icon: "/images/icon/addDonor.svg" },
        ];

        const adminItems = adminStatus ? [
            { name: "User Management", href: "/users", icon: "/images/icon/dashboard.svg" },
        ] : [];

        return [...baseItems, ...donorItems, ...adminItems];
    };

    const navItems = getNavItems();
    const isActive = (href) => pathname === href;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 bg-white lg:shadow-sm transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } ${isCollapsed ? 'w-16' : 'w-64'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className={`flex items-center h-20 bg-[#402575] border-b border-purple-600/20 transition-all duration-500 ${
                        isCollapsed ? 'justify-center px-2' : 'justify-between px-6'
                    }`}>
                        <Link href="/dashboard" className="flex items-center">
                            <Image
                                src={isCollapsed ? "/images/icon/brandLogoOnly.svg" : "/images/icon/brand.svg"}
                                alt="Logo"
                                width={isCollapsed ? 32 : 120}
                                height={32}
                                className="transition-all duration-500"
                            />
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden text-white/80 hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
                        {navItems.map((item) => (
                            <div key={item.name} className="relative group">
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center rounded-lg text-base font-medium transition-all duration-300 ${
                                        isActive(item.href)
                                            ? "bg-gradient-to-r from-[#402575] to-[#5B4B8A] text-white shadow-sm"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    } ${
                                        isCollapsed 
                                            ? 'justify-center p-3 mx-1' 
                                            : 'gap-3 px-4 py-3 mx-2'
                                    }`}
                                >
                                    <div className="flex-shrink-0">
                                        <Image 
                                            src={item.icon} 
                                            alt={item.name} 
                                            width={20} 
                                            height={20} 
                                            className={`h-5 w-5 transition-all duration-300 ${
                                                isActive(item.href) ? 'brightness-0 invert' : 'brightness-0'
                                            }`}
                                        />
                                    </div>
                                    <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                                        isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                                    }`}>
                                        {item.name}
                                    </span>
                                </Link>
                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                        {item.name}
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}