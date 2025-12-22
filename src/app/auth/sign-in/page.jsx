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
    <div className="h-screen from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[calc(100vh-2rem)] bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col xl:flex-row h-full gap-[60px]">
          {/* Left Side - Form */}
          <div className="w-full xl:w-4/5 p-8 sm:p-12 xl:p-16 flex flex-col justify-center">
            <div className="max-w-lg mx-auto w-full">
              <div className="text-center mb-8">
                <Link href="/" className="inline-block mb-2">
                  <Image
                    src="/images/logo/logosignin.svg"
                    alt="Logo"
                    width={60}
                    height={40}
                    className="mx-auto"
                    priority
                  />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                 Sign in to Seamlessly Manage Patient Profiles, Sample Collections, Blood Tests, and Consent Forms
                </p>
              </div>
              <Signin />
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="xl:flex w-full xl:w-4/5 from-blue-50 to-indigo-100 items-center justify-center">
            <Image
              src="/images/cover/singinCover.svg"
              alt="Sign In Cover"
              width={450}
              height={400}
              className="object-contain max-w-full max-h-full"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
