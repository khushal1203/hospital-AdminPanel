"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";
import { EmailIcon } from "@/assets/icons";
import { ButtonLoader } from "@/components/ui/LoadingSpinner";

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

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
                setMessage("Password reset instructions sent to your email");
                if (result.resetUrl) {
                    console.log("Reset URL:", result.resetUrl);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex flex-col xl:flex-row min-h-[600px]">
                    {/* Left Side - Form */}
                    <div className="w-full xl:w-1/2 p-8 sm:p-12 xl:p-16 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <div className="text-center mb-8">
                                <Link href="/" className="inline-block mb-6">
                                    <Image
                                        src="/images/icon/brand-black.svg"
                                        alt="Logo"
                                        width={160}
                                        height={40}
                                        className="mx-auto"
                                    />
                                </Link>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Forgot Password?
                                </h1>
                                <p className="text-gray-600">
                                    Enter your email address and we'll send you instructions to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                {message && (
                                    <div className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-600">
                                        {message}
                                    </div>
                                )}

                                <InputGroup
                                    type="email"
                                    label="Email"
                                    className="mb-6 [&_input]:py-[15px]"
                                    placeholder="Enter your email"
                                    name="email"
                                    handleChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    icon={<EmailIcon />}
                                    required
                                />

                                <div className="mb-4.5">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-4 font-medium text-white transition hover:from-purple-700 hover:to-pink-700 disabled:opacity-70"
                                    >
                                        Send Reset Instructions
                                        {loading && <ButtonLoader />}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <Link
                                        href="/auth/sign-in"
                                        className="text-purple-600 hover:text-purple-700 hover:underline"
                                    >
                                        Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Illustration */}
                    <div className="hidden xl:flex w-full xl:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 p-12 flex flex-col justify-center text-white">
                            <div className="mb-8">
                                <h2 className="text-4xl font-bold mb-4">
                                    Reset Your Password
                                </h2>
                                <p className="text-xl text-white/90 mb-6">
                                    We'll help you get back into your hospital admin account securely and quickly.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <span className="text-white/90">Secure Reset Process</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <span className="text-white/90">Email Verification</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                        <span className="text-white/90">Quick Access Restore</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                            <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
                            <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}