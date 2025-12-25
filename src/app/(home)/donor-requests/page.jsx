"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DonorRequestsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the existing donors/requests page
    router.replace("/donors/requests");
  }, [router]);

  return <LoadingSpinner message="Redirecting..." />;
}