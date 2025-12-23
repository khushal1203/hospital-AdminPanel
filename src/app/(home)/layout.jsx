"use client";

import Sidebar from "@/components/Layouts/sidebar";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MdMenu, MdNotifications } from "react-icons/md";
import { isAdmin } from "@/utils/roleUtils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import NotificationDropdown from "@/components/Layouts/TopNavigation/NotificationDropdown";
import Link from "next/link";
import Image from "next/image";

function Header({ onMenuClick, onToggleCollapse }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [adminStatus, setAdminStatus] = useState(false);
    const { user } = useCurrentUser();
    const dropdownRef = useRef(null);

    useEffect(() => {
        setAdminStatus(isAdmin());
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

    return (
        <header className="sticky top-0 z-40 bg-[#402575] border-b border-purple-600/20 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleCollapse}
                        className="hidden lg:block p-2 rounded-lg text-white/80 hover:bg-white/15 hover:text-white transition-colors"
                    >
                        <Image
                            src="/images/icon/sidebarShort.svg"
                            alt="Toggle Sidebar"
                            width={20}
                            height={20}
                        />
                    </button>
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg text-white/80 hover:bg-white/15 hover:text-white transition-colors"
                    >
                        <MdMenu className="h-6 w-6" />
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationDropdown />
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                            <div className="relative w-10 h-10 flex-shrink-0">
                                <Image
                                    src={user?.profileImage || "/images/user/user-03.png"}
                                    alt="User"
                                    width={40}
                                    height={40}
                                    className="w-full h-full rounded-full ring-2 ring-white/20 object-cover"
                                    key={user?.profileImage}
                                    onError={(e) => {
                                        e.target.src = "/images/user/user-03.png";
                                    }}
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></div>
                            </div>
                            <span className="hidden text-base font-medium md:block max-w-28 truncate">{user?.fullName || "User"}</span>
                            <svg
                                className={`h-5 w-5 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {showUserMenu && (
                            <div className="absolute right-3 mt-2 w-64 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                {/* Header */}
                                <div className="px-4 py-4 bg-gradient-to-r from-[#402575] to-[#5B4B8A]">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Image
                                                src={user?.profileImage || "/images/user/user-03.png"}
                                                alt="User"
                                                width={48}
                                                height={48}
                                                className="w-12 h-12 rounded-full ring-2 ring-white/30 object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/images/user/user-03.png";
                                                }}
                                            />
                                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 ring-2 ring-white"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{user?.fullName || "User"}</p>
                                            <p className="text-xs text-white/80 truncate">{user?.email || "user@example.com"}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Menu Items */}
                                <div className="py-2">
                                    <Link
                                        href="/profile"
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 mr-3 group-hover:bg-blue-200">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">Profile</p>
                                            <p className="text-xs text-gray-500">View and edit profile</p>
                                        </div>
                                    </Link>
                                    {adminStatus && (
                                        <Link
                                            href="/users"
                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600 mr-3 group-hover:bg-purple-200">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium">User Management</p>
                                                <p className="text-xs text-gray-500">Manage system users</p>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                                
                                {/* Divider */}
                                <div className="border-t border-gray-100"></div>
                                
                                {/* Logout */}
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('user');
                                            window.location.href = '/auth/sign-in';
                                        }}
                                        className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 mr-3 group-hover:bg-red-200">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">Sign Out</p>
                                            <p className="text-xs text-gray-500">Logout from account</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isDonorPage = pathname?.startsWith('/donors');
  const isDashboardPage = pathname === '/dashboard';
  const isHomePage = pathname === '/home';
  const isFullWidthPage = isDonorPage || isDashboardPage || isHomePage;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <main className={`flex-1 overflow-y-auto bg-white`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
