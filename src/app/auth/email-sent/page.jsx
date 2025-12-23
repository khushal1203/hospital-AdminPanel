"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/utils/toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function EmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Password reset email sent successfully!");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center from-purple-50 via-white to-pink-50 p-4">
      <div className="min-h-[80vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex h-full flex-col gap-[60px] xl:flex-row">
          {/* Left Side - Content */}
          <div className="flex w-full flex-col justify-center p-8 sm:p-12 xl:w-4/5 xl:p-16">
            <div className="mx-auto w-full max-w-lg text-center">
              <Link href="/" className="mb-8 inline-block">
                <Image
                  src="/images/logo/logosignin.svg"
                  alt="Logo"
                  width={60}
                  height={40}
                  className="mx-auto"
                  priority
                />
              </Link>

              <h1 className="mb-6 text-3xl font-bold text-gray-900">
                Mail Sent
              </h1>

              <p className="mb-8 leading-relaxed text-gray-600">
                Thanks! If{" "}
                <span className="font-semibold text-gray-900">{email}</span>{" "}
                matches an email address we have on file, then we've sent you an
                email containing further instructions for resetting your
                password. If you haven't received an email in 5 minutes, check
                your spam, resend, or try a different email address.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="block w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-4 font-medium text-white transition hover:from-purple-700 hover:to-pink-700 disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Resend Email"}
                </button>

                <Link
                  href="/auth/sign-in"
                  className="block text-purple-600 hover:text-purple-700 hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="hidden w-full items-center justify-center from-blue-50 to-indigo-100 xl:flex xl:w-3/5">
            <Image
              src="/images/cover/singinCover.svg"
              alt="Email Sent Cover"
              width={450}
              height={400}
              className="max-h-full max-w-full object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailSent() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <EmailSentContent />
    </Suspense>
  );
}
