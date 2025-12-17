"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole, ROLES } from "@/utils/roleUtils";
import AdminDashboard from "./AdminDashboard";

/**
 * DashboardSwitcher - Routes users to appropriate dashboard based on their role
 */
export default function DashboardSwitcher() {
    const router = useRouter();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user role from localStorage
        const userRole = getUserRole();

        if (!userRole) {
            // No role found, redirect to login
            router.push("/auth/sign-in");
            return;
        }

        setRole(userRole);
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    // All roles use the same admin dashboard
    return <AdminDashboard />;
}
