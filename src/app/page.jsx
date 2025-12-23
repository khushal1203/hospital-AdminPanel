"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/sign-in");
      return;
    }

    router.push("/home");
  }, [router]);

  return <LoadingSpinner message="Redirecting..." />;
}
