"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";
import { EmailIcon } from "@/assets/icons";

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
                // For development, show the reset URL
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
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="flex flex-wrap items-center">
                <div className="w-full xl:w-1/2">
                    <div className="w-full p-4 sm:p-12.5 xl:p-15">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
                                    Forgot Password?
                                </h2>
                                <p className="text-body text-dark-4 dark:text-dark-6">
                                    Enter your email address and we'll send you instructions to reset your password.
                                </p>
                            </div>

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
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-70"
                                >
                                    Send Reset Instructions
                                    {loading && (
                                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    )}
                                </button>
                            </div>

                            <div className="text-center">
                                <Link
                                    href="/auth/sign-in"
                                    className="text-primary hover:underline"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden rounded-2xl px-12.5 pt-12.5">
                        <Link className="mb-10 inline-block" href="/">
                            <Image
                                src="/images/icon/brand.svg"
                                alt="Logo"
                                width={176}
                                height={32}
                            />
                        </Link>

                        <p className="mb-3 text-xl font-medium text-white">
                            Reset your password
                        </p>

                        <h1 className="mb-4 text-2xl font-bold text-white sm:text-heading-3">
                            We'll help you get back in
                        </h1>

                        <p className="w-full max-w-[375px] font-medium text-white/80">
                            Enter your email address and we'll send you a secure link to reset your password
                        </p>

                        <div className="mt-31">
                            <Image
                                src="/images/grids/grid-02.svg"
                                alt="Grid"
                                width={405}
                                height={325}
                                className="mx-auto dark:opacity-30"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}