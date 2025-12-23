"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Signin from "@/components/Auth/Signin";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center from-purple-50 via-white to-pink-50 p-4">
      <div className="min-h-[80vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex h-full flex-col gap-[60px] xl:flex-row">
          {/* Left Side - Form */}
          <div className="flex w-full flex-col justify-center p-8 sm:p-12 xl:w-4/5 xl:p-16">
            <div className="mx-auto w-full max-w-lg">
              <div className="mb-8 text-center">
                <Link href="/" className="mb-2 inline-block">
                  <Image
                    src="/images/logo/logosignin.svg"
                    alt="Logo"
                    width={60}
                    height={40}
                    className="mx-auto"
                    priority
                  />
                </Link>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                  Sign in to Seamlessly Manage Patient Profiles, Sample
                  Collections, Blood Tests, and Consent Forms
                </p>
              </div>
              <Signin />
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="hidden w-full items-center justify-center from-blue-50 to-indigo-100 xl:flex xl:w-3/5">
            <Image
              src="/images/cover/singinCover.svg"
              alt="Sign In Cover"
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
