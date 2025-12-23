"use client";

import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

export default function BackButton({
  href,
  label = "Back",
  className = "",
  showIcon = true,
}) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${className}`}
    >
      {showIcon && <MdArrowBack className="h-4 w-4" />}
      {label}
    </button>
  );
}
