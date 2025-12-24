"use client";

import Link from "next/link";
import { MdHome, MdArrowBack } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#402575] opacity-20">404</h1>
          <div className="-mt-8">
            <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
            <p className="mt-4 text-gray-600">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <div className="mx-auto h-32 w-32 rounded-full bg-[#402575]/10 flex items-center justify-center">
            <svg
              className="h-16 w-16 text-[#402575]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#402575] px-6 py-3 text-white font-medium transition-colors hover:bg-[#402575]/90 focus:outline-none focus:ring-2 focus:ring-[#402575] focus:ring-offset-2"
          >
            <MdHome className="h-5 w-5" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <MdArrowBack className="h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you think this is an error, please{" "}
            <Link href="/profile" className="text-[#402575] hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}