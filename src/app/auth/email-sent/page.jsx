"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/utils/toast";

export default function EmailSent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
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
        <div className="h-screen from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl h-[calc(100vh-2rem)] bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex flex-col xl:flex-row h-full gap-[60px]">
                    {/* Left Side - Content */}
                    <div className="w-full xl:w-4/5 p-8 sm:p-12 xl:p-16 flex flex-col justify-center">
                        <div className="max-w-lg mx-auto w-full text-center">
                            <Link href="/" className="inline-block mb-8">
                                <Image
                                    src="/images/logo/logosignin.svg"
                                    alt="Logo"
                                    width={60}
                                    height={40}
                                    className="mx-auto"
                                    priority
                                />
                            </Link>
                            
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                                Mail Sent
                            </h1>
                            
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Thanks! If <span className="font-semibold text-gray-900">{email}</span> matches an email address we have on file, then we've sent you an email containing further instructions for resetting your password. If you haven't received an email in 5 minutes, check your spam, resend, or try a different email address.
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
                    <div className="xl:flex w-full xl:w-4/5 from-blue-50 to-indigo-100 items-center justify-center">
                        <Image
                            src="/images/cover/singinCover.svg"
                            alt="Email Sent Cover"
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