"use client";

import Link from "next/link";
import { MdHome, MdArrowBack } from "react-icons/md";
import Sidebar from "@/components/Layouts/sidebar";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { isAdmin } from "@/utils/roleUtils";
import NotificationDropdown from "@/components/Layouts/TopNavigation/NotificationDropdown";
import Image from "next/image";

function Header({ onMenuClick, onToggleCollapse }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [adminStatus, setAdminStatus] = useState(false);
  const { user } = useCurrentUser();

  useEffect(() => {
    setAdminStatus(isAdmin());
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-purple-600/20 bg-[#402575] shadow-sm">
      <div className="flex items-center justify-between px-4" style={{ padding: "12px 11px 11px 11px" }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleCollapse}
            className="hidden rounded-lg p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white lg:block"
          >
            <Image src="/images/icon/sidebarShort.svg" alt="Toggle Sidebar" width={20} height={20} />
          </button>
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white lg:hidden"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center md:flex">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 rounded-full border border-white/20 bg-[#281156] py-2 pl-10 pr-12 text-white placeholder-white/60 transition-all focus:bg-[#281156]/80 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <img src="/images/icon/searchIcon.svg" alt="Search" className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/60" />
            </div>
          </div>
          <NotificationDropdown />
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-white">
            <Image src={user?.profileImage || "/images/user/user-03.png"} alt="User" width={40} height={40} className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20" />
            <span className="hidden max-w-28 truncate text-base font-medium md:block">{user?.fullName || "User"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function NotFound() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <style jsx>{`
              @keyframes pulse-slow {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.8; }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
              }
              @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
              .pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
              .float { animation: float 3s ease-in-out infinite; }
              .heartbeat { animation: heartbeat 2s ease-in-out infinite; }
            `}</style>
            
            <div className="flex min-h-full items-center justify-center px-4 py-12">
              {/* Background Medical Icons */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 pulse-slow">
                  <svg className="h-8 w-8 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2h2V6h5v2h2V6h1c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h1V6z"/>
                  </svg>
                </div>
                <div className="absolute top-40 right-20 pulse-slow" style={{animationDelay: '1s'}}>
                  <svg className="h-6 w-6 text-green-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="absolute bottom-32 left-20 pulse-slow" style={{animationDelay: '2s'}}>
                  <svg className="h-10 w-10 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>

              <div className="relative w-full max-w-lg text-center">
                {/* Medical Cross Background */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 pulse-slow">
                  <svg className="h-32 w-32 text-red-100" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2z"/>
                    <path d="M5 7v10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2zm8 0v10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2z"/>
                  </svg>
                </div>

                {/* Main Content */}
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
                  {/* 404 with Medical Theme */}
                  <div className="mb-8">
                    <div className="relative">
                      <h1 className="text-8xl font-bold text-transparent bg-gradient-to-r from-[#402575] to-red-500 bg-clip-text">404</h1>
                      <div className="absolute top-2 right-8 heartbeat">
                        <svg className="h-8 w-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="-mt-4">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Medical Record Not Found</h2>
                      <p className="text-gray-600 leading-relaxed">
                        The page you're looking for seems to have been discharged from our system.
                        Let's get you back to a healthy location!
                      </p>
                    </div>
                  </div>

                  {/* Hospital Illustration */}
                  <div className="mb-8 float">
                    <div className="mx-auto h-40 w-40 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-lg">
                      <div className="relative">
                        {/* Hospital Building */}
                        <svg className="h-20 w-20 text-[#402575]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                          <path d="M11 7h2v2h2v2h-2v2h-2v-2H9V9h2V7z" fill="white"/>
                        </svg>
                        {/* Pulse Line */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <svg className="h-4 w-16 text-red-400" viewBox="0 0 64 16" fill="none">
                            <path d="M0 8h8l2-4 4 8 4-8 2 4h44" stroke="currentColor" strokeWidth="2" className="pulse-slow"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <Link href="/dashboard" className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#402575] to-[#5B4B8A] px-8 py-4 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform">
                      <MdHome className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Return to Dashboard
                      <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Link>
                    
                    <button onClick={() => window.history.back()} className="group inline-flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-gray-700 font-semibold transition-all duration-300 hover:border-[#402575] hover:text-[#402575] hover:shadow-md hover:scale-105 transform">
                      <MdArrowBack className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Previous Page
                    </button>
                  </div>

                  {/* Emergency Contact */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                    <div className="flex items-center justify-center gap-2 text-red-600">
                      <svg className="h-5 w-5 heartbeat" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className="text-sm font-medium">Need immediate assistance?</span>
                    </div>
                    <p className="text-xs text-red-500 mt-1 text-center">
                      Contact our IT support team for technical emergencies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}