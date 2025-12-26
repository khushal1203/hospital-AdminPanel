"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MdNotifications, MdMenu, MdClose } from "react-icons/md";
import { getUserRole, ROLES, isAdmin } from "@/utils/roleUtils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import NotificationDropdown from "./NotificationDropdown";

export default function TopNavigation() {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [role, setRole] = useState(null);
  const [adminStatus, setAdminStatus] = useState(false);
  const { user } = useCurrentUser();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    setRole(getUserRole());
    setAdminStatus(isAdmin());
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNavItems = () => {
    const baseItems = [
      { name: "Home", href: "/home", icon: "/images/icon/home.svg" },
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: "/images/icon/dashboard.svg",
      },
    ];

    if (role === ROLES.LABORATORY) {
      return [
        ...baseItems,
        {
          name: "Active Donors",
          href: "/donors/active",
          icon: "/images/icon/activeDonors.svg",
        },
        {
          name: "Semen Storage",
          href: "/donors/semen",
          icon: "/images/icon/seemansDonor.svg",
        },
      ];
    }

    const donorItems = [
      {
        name: "Active Donors",
        href: "/donors/active",
        icon: "/images/icon/activeDonors.svg",
      },
      {
        name: "Donors History",
        href: "/donors/history",
        icon: "/images/icon/donorhistory.svg",
      },
      {
        name: "Semen Storage",
        href: "/donors/semen",
        icon: "/images/icon/seemansDonor.svg",
      },
      {
        name: "Add Donor",
        href: "/donors/add",
        icon: "/images/icon/addDonor.svg",
      },
    ];

    // Only admins can see user management
    const adminItems = adminStatus
      ? [
          {
            name: "User Management",
            href: "/users",
            icon: "/images/icon/dashboard.svg",
          },
        ]
      : [];

    return [...baseItems, ...donorItems, ...adminItems];
  };

  const navItems = getNavItems();
  const isActive = (href) => pathname === href;

  return (
    <nav className="sticky top-0 z-[9999999] border-b border-white/10 bg-gradient-to-r from-[#5B4B8A] to-[#6B5B9A] shadow-lg">
      <div
        className="mx-auto px-4 sm:px-6"
        style={{ backgroundColor: "#402575" }}
      >
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white md:hidden"
            >
              {showMobileMenu ? (
                <MdClose className="h-6 w-6" />
              ) : (
                <MdMenu className="h-6 w-6" />
              )}
            </button>

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
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base font-bold transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-white/80 hover:bg-white/15 hover:text-white hover:shadow-sm"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image
                    src={(() => {
                        // Use doctorImage if profileImage is default or empty
                      if (!user?.profileImage || user?.profileImage === "/images/user/user-03.png") {
                        if (user?.doctorImage) {
                          return user.doctorImage;
                        }
                      }
                      
                      // Use profileImage if it's not default
                      if (user?.profileImage && user?.profileImage !== "/images/user/user-03.png") {
                        return user.profileImage;
                      }
                      
                      // Fallback to default
                      return "/images/user/user-03.png";
                    })()}
                    alt="User"
                    width={40}
                    height={40}
                    className="h-full w-full rounded-full object-cover ring-2 ring-white/20"
                    key={`${user?._id}-${user?.profileImage}-${user?.doctorImage}`}
                    onError={(e) => {
                      e.target.src = "/images/user/user-03.png";
                    }}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></div>
                </div>
                <span className="hidden max-w-28 truncate text-base font-medium md:block">
                  {user?.fullName || "User"}
                </span>
                <svg
                  className={`h-5 w-5 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className="animate-in slide-in-from-top-2 absolute right-0 mt-3 w-56 rounded-xl bg-white py-2 shadow-2xl ring-1 ring-black/5 duration-200">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {user?.fullName || "User"}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg
                        className="mr-3 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </Link>
                    {adminStatus && (
                      <Link
                        href="/users"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          className="mr-3 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                        User Management
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/auth/sign-in";
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"
                    >
                      <svg
                        className="mr-3 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div
            ref={mobileMenuRef}
            className="absolute left-0 right-0 top-full z-50 border-t border-white/20 bg-gradient-to-r from-[#5B4B8A] to-[#6B5B9A] shadow-lg md:hidden"
          >
            <div className="space-y-3 px-4 py-6">
              {navItems.map((item) => {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-4 rounded-lg px-4 py-4 text-base font-semibold transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-white/25 text-white shadow-sm"
                        : "text-white/90 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
