"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserRole, ROLES } from "@/utils/roleUtils";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }

    const role = getUserRole();
    
    if (role === ROLES.RECEPTIONIST) {
      router.push("/home");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
}
