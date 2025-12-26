"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getUserRole, ROLES, isAdmin } from "@/utils/roleUtils";

export default function Sidebar({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}) {
  const pathname = usePathname();
  const [role, setRole] = useState(null);
  const [adminStatus, setAdminStatus] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) return;
      
      const data = await response.json();
      if (data.notifications) {
        const count = data.notifications.filter(n => !n.isRead).length;
        setUnreadCount(count);
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  useEffect(() => {
    setRole(getUserRole());
    setAdminStatus(isAdmin());
    setIsLoaded(true);
    
    if (isAdmin() || role === ROLES.DOCTOR) {
      fetchNotificationCount();
      // Refresh count every 30 seconds
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const getNavItems = () => {
    // Admin menu items with sections
    if (adminStatus) {
      return [
        {
          section: "MAIN MENU",
          items: [
            // { name: "Home", href: "/home", icon: "/images/icon/home.svg" },
            {
              name: "Dashboard",
              href: "/dashboard",
              icon: "/images/icon/dashboard.svg",
            },
            {
              name: "Active Donors",
              href: "/donors/active",
              icon: "/images/icon/activeDonors.svg",
            },
            {
              name: "Donors/Patients",
              href: "/donors/history",
              icon: "/images/icon/donorPatines.svg",
            },
            {
              name: "Donors Requests",
              href: "/donors/requests",
              icon: "/images/icon/donorRequest.svg",
            },
            { name: "Alerts", href: "/alerts", icon: "/images/icon/alert.svg", hasNotifications: true },
            {
              name: "Centres/Doctors",
              href: "/centres",
              icon: "/images/icon/donorHospital.svg",
            },
            {
              name: "Staff Management",
              href: "/users",
              icon: "/images/icon/donorhistory.svg",
            },
            {
              name: "Consent Forms",
              href: "/consent-forms",
              icon: "/images/icon/consentForms.svg",
            },
          ],
        },
        {
          section: "SEMEN",
          items: [
            {
              name: "Semen Storage",
              href: "/storage",
              icon: "/images/icon/seemansDonor.svg",
            },
          ],
        },
        {
          section: "TOOLS",
          items: [
            { name: "Help", href: "/help", icon: "/images/icon/help.svg" },
            {
              name: "Settings",
              href: "/profile",
              icon: "/images/icon/setting.svg",
            },
            {
              name: "Logout",
              href: "/logout",
              icon: "/images/icon/logOut.svg",
              onClick: handleLogout,
            },
          ],
        },
      ];
    }

    // Non-admin menu items (flat structure)
    const baseItems = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: "/images/icon/dashboard.svg",
      },
    ];

    if (role === ROLES.LABORATORY) {
      return [
        {
          section: "MAIN MENU",
          items: [
            ...baseItems,
            {
              name: "Active Donors",
              href: "/donors/active",
              icon: "/images/icon/activeDonors.svg",
            },
          ],
        },
        {
          section: "SEMEN",
          items: [
            {
              name: "Semen Storage",
              href: "/storage",
              icon: "/images/icon/seemansDonor.svg",
            },
          ],
        },
        {
          section: "TOOLS",
          items: [
            { name: "Help", href: "/help", icon: "/images/icon/help.svg" },
            {
              name: "Settings",
              href: "/settings",
              icon: "/images/icon/setting.svg",
            },
            {
              name: "Logout",
              href: "/logout",
              icon: "/images/icon/logOut.svg",
              onClick: handleLogout,
            },
          ],
        },
      ];
    }

    if (role === ROLES.DOCTOR) {
      return [
        {
          section: "MAIN MENU",
          items: [
            ...baseItems,
            {
              name: "Follow-up",
              href: "/donors/active",
              icon: "/images/icon/activeDonors.svg",
            },
            {
              name: "Request Status",
              href: "/donors/requests",
              icon: "/images/icon/donorRequest.svg",
            },
            {
              name: "Donors/Patients",
              href: "/donors/history",
              icon: "/images/icon/donorPatines.svg",
            },
            {
              name: "Alloted Donors",
              href: "/donors/allotted",
              icon: "/images/icon/donorhistory.svg",
            },
            { name: "Alerts", href: "/alerts", icon: "/images/icon/alert.svg", hasNotifications: true },
          ],
        },
        {
          section: "SEMEN",
          items: [
            {
              name: "Semen Storage",
              href: "/storage",
              icon: "/images/icon/seemansDonor.svg",
            },
          ],
        },
        {
          section: "TOOLS",
          items: [
            { name: "Help", href: "/help", icon: "/images/icon/help.svg" },
            {
              name: "Settings",
              href: "/settings",
              icon: "/images/icon/setting.svg",
            },
            {
              name: "Logout",
              href: "/logout",
              icon: "/images/icon/logOut.svg",
              onClick: handleLogout,
            },
          ],
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
        name: "Add Donor",
        href: "/donors/add",
        icon: "/images/icon/addDonor.svg",
      },
    ];

    return [
      { section: "MAIN MENU", items: [...baseItems, ...donorItems] },
      {
        section: "SEMEN",
        items: [
          {
            name: "Semen Storage",
            href: "/storage",
            icon: "/images/icon/seemansDonor.svg",
          },
        ],
      },
      {
        section: "TOOLS",
        items: [
          { name: "Help", href: "/help", icon: "/images/icon/help.svg" },
          {
            name: "Settings",
            href: "/settings",
            icon: "/images/icon/setting.svg",
          },
          {
            name: "Logout",
            href: "/logout",
            icon: "/images/icon/logOut.svg",
            onClick: handleLogout,
          },
        ],
      },
    ];
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/sign-in";
  };

  const navItems = getNavItems();
  const isActive = (href) => {
    if (pathname === href) return true;
    // Handle sub-routes for specific menu items - be more specific to avoid conflicts
    if (href === '/donors/active' && (pathname.startsWith('/donors/add') || pathname.startsWith('/donors/active/'))) return true;
    if (href === '/donors/requests' && pathname.startsWith('/donors/requests/')) return true;
    if (href === '/donors/history' && pathname.startsWith('/donors/history/')) return true;
    if (href === '/donors/allotted' && pathname.startsWith('/donors/allotted/')) return true;
    if (href === '/donors/add' && pathname.startsWith('/donors/add/')) return true;
    if (href === '/storage' && pathname.startsWith('/storage/')) return true;
    if (href === '/alerts' && pathname.startsWith('/alerts/')) return true;
    if (href === '/centres' && pathname.startsWith('/centres/')) return true;
    if (href === '/users' && pathname.startsWith('/users/')) return true;
    if (href === '/consent-forms' && pathname.startsWith('/consent-forms/')) return true;
    if (href === '/dashboard' && pathname.startsWith('/dashboard/')) return true;
    if (href === '/help' && pathname.startsWith('/help/')) return true;
    if (href === '/settings' && pathname.startsWith('/settings/')) return true;
    if (href === '/profile' && pathname.startsWith('/profile/')) return true;
    return false;
  };

  // Don't render until role is loaded
  if (!isLoaded) {
    return (
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:static lg:inset-0 lg:translate-x-0 lg:shadow-sm ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-16" : "w-64"}`}
      >
        <div className="flex h-full flex-col">
          <div
            className={`flex h-20 items-center border-b border-purple-600/20 bg-[#402575] transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isCollapsed ? "justify-center px-2" : "justify-between px-6"
            }`}
          >
            <Link href="/dashboard" className="flex items-center">
              <Image
                src={
                  isCollapsed
                    ? "/images/icon/brandLogoOnly.svg"
                    : "/images/icon/brand.svg"
                }
                alt="Logo"
                width={isCollapsed ? 32 : 120}
                height={32}
                className="transition-all duration-200 ease-out"
              />
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#402575]"></div>
          </div>
        </div>
      </div>
    );
  }

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
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:static lg:inset-0 lg:translate-x-0 lg:shadow-sm ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "lg:w-16" : "lg:w-64"} w-80 sm:w-64`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className={`flex h-20 items-center border-b border-purple-600/20 bg-[#402575] transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isCollapsed ? "justify-center px-2" : "justify-between px-6"
            }`}
          >
            <Link href="/dashboard" className="flex items-center">
              <Image
                src={
                  isCollapsed
                    ? "/images/icon/brandLogoOnly.svg"
                    : "/images/icon/brand.svg"
                }
                alt="Logo"
                width={isCollapsed ? 32 : 120}
                height={32}
                className="transition-all duration-200 ease-out"
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white lg:hidden"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-6">
            <div className="space-y-4">
              {navItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* Section Label */}
                {section.section && !isCollapsed && (
                  <div className="mb-3 px-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {section.section}
                    </h3>
                  </div>
                )}

                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <div key={item.name} className="group relative">
                      {item.onClick ? (
                        <button
                          onClick={() => { item.onClick(); setIsOpen(false); }}
                          className={`flex w-full items-center rounded-lg text-sm font-medium transition-all duration-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                            isCollapsed
                              ? "mx-1 justify-center p-3"
                              : "mx-2 gap-3 px-3 py-2.5"
                          }`}
                        >
                          <div className="flex-shrink-0">
                            <Image
                              src={item.icon}
                              alt={item.name}
                              width={24}
                              height={24}
                              className="h-6 w-6 transition-all duration-300 brightness-0"
                            />
                          </div>
                          <span
                            className={`overflow-hidden whitespace-nowrap transition-[width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                            }`}
                          >
                            {item.name}
                          </span>
                        </button>
                      ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center rounded-lg text-sm font-medium transition-all duration-300 ${
                          isActive(item.href)
                            ? "bg-gradient-to-r from-[#402575] to-[#5B4B8A] text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        } ${
                          isCollapsed
                            ? "mx-1 justify-center p-3"
                            : "mx-2 gap-3 px-3 py-2.5"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={24}
                            height={24}
                            className={`h-6 w-6 transition-all duration-300 ${
                              isActive(item.href)
                                ? "brightness-0 invert"
                                : "brightness-0"
                            }`}
                          />
                        </div>
                        <span
                          className={`overflow-hidden whitespace-nowrap transition-[width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                          }`}
                        >
                          {item.name}
                          {item.hasNotifications && unreadCount > 0 && (
                            <span className="ml-2 inline-flex h-5 w-5 min-w-[20px] items-center justify-center rounded-full bg-white text-xs font-bold text-black border border-gray-300 leading-none">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </span>
                      </Link>
                      )}
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="pointer-events-none absolute left-full top-1/2 z-[9999] ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 shadow-lg transition-all duration-200 ease-out group-hover:opacity-100 hidden lg:block">
                          {item.name}
                          <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1 -translate-y-1/2 rotate-45 bg-gray-900"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
