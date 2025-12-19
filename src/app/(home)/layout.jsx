"use client";

import TopNavigation from "@/components/Layouts/TopNavigation";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const isDonorPage = pathname?.startsWith('/donors');
  const isDashboardPage = pathname === '/dashboard';
  const isFullWidthPage = isDonorPage || isDashboardPage;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopNavigation />

      <main className={isFullWidthPage ? "" : "mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10"}>
        {children}
      </main>
    </div>
  );
}
