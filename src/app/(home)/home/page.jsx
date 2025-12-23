"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUserRole, ROLES, isLaboratory } from "@/utils/roleUtils";
import { toast } from "@/utils/toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import HomeSpinner from "@/components/ui/HomeSpinner";

export default function HomePage() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(new Date());
    const { user, loading } = useCurrentUser();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/sign-in");
        }
    }, [router]);

    useEffect(() => {
        // Update time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/auth/sign-in");
    };

    const [role, setRole] = useState(null);
    const [filteredCards, setFilteredCards] = useState([]);

    useEffect(() => {
        const userRole = getUserRole();
        setRole(userRole);
        
        const cards = getActionCards().filter(card => {
            // Hide Add Donor card only for laboratory users
            if (card.title === "Add Donor" && userRole === ROLES.LABORATORY) {
                return false;
            }
            return card.allowedRoles.includes(userRole);
        });
        setFilteredCards(cards);
    }, []);

    const getActionCards = () => {
        return [
            {
                title: "Dashboard",
                description: "View analytics and system overview",
                icon: "/images/icon/dashboard.svg",
                color: "from-purple-500 to-purple-600",
                route: "/dashboard",
                allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.LABORATORY]
            },
            {
                title: "Add Donor",
                description: "Register new donor (oocyte/semen)",
                icon: "/images/icon/addDonor.svg",
                color: "from-blue-500 to-blue-600",
                route: "/donors/add",
                allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR]
            },
            {
                title: "Active Donor Cases",
                description: "View all active donor cases",
                icon: "/images/icon/activeDonors.svg",
                color: "from-green-500 to-green-600",
                route: "/donors/active",
                allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.LABORATORY]
            },
            {
                title: "Donor History",
                description: "View donor history and records",
                icon: "/images/icon/donorhistory.svg",
                color: "from-orange-500 to-orange-600",
                route: "/donors/history",
                allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.LABORATORY]
            },
            {
                title: "Semen Storage",
                description: "Manage semen storage and inventory",
                icon: "/images/icon/seemansDonor.svg",
                color: "from-teal-500 to-teal-600",
                route: "/donors/semen",
                allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.LABORATORY]
            },
            {
                title: "Notifications",
                description: "View alerts and notifications",
                icon: "/images/icon/notifiction.svg",
                color: "from-red-500 to-red-600",
                route: "/notifications",
                allowedRoles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.LABORATORY]
            },
        ];
    };

    const actionCards = getActionCards();

    const handleCardClick = (card) => {
        const userRole = getUserRole();
        
        if (!card.allowedRoles.includes(userRole)) {
            toast.error("You don't have permission to access this feature.");
            return;
        }
        
        router.push(card.route);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = () => {
        return currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen relative">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/images/cover/homeCover.svg')"
                }}
            >
                <div className="absolute inset-0 bg-white/65 dark:bg-gray-700/70"></div>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 mx-auto max-w-6xl px-4 py-12">
                {/* User Profile Section */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center">
                        {loading ? (
                            <HomeSpinner />
                        ) : (
                            <Image
                                src={user?.profileImage || "/images/user/user-03.png"}
                                alt="Profile"
                                width={128}
                                height={128}
                                className="h-full w-full object-cover"
                                key={user?.profileImage}
                            />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        {loading ? (
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
                        ) : (
                            user?.fullName || "User"
                        )}
                    </h1>
                    <div className="mt-1 text-gray-600 dark:text-gray-400">
                        {loading ? (
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mx-auto"></div>
                        ) : (
                            `${user?.email || ""} | ${user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Donor Care Executive"}`
                        )}
                    </div>

                    {/* Time Display */}
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-md dark:bg-gray-800">
                        <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {formatTime(currentTime)} | {formatDate()}
                        </span>
                    </div>
                </div>

                {/* Action Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCards.map((card, index) => {
                        return (
                            <button
                                key={index}
                                onClick={() => handleCardClick(card)}
                                className="group rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl dark:bg-gray-800"
                            >
                                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${card.color} p-4`}>
                                    <Image 
                                        src={card.icon} 
                                        alt={card.title}
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 filter brightness-0 invert" 
                                    />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                                    {card.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {card.description}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* Logout Button */}
                <div className="mt-12 text-center">
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:from-pink-600 hover:to-pink-700"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
    );
}
