"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole, ROLES } from "@/utils/roleUtils";
import AdminDashboard from "./AdminDashboard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    // All roles use the same admin dashboard
    return <AdminDashboard />;
}
