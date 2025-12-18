"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid reset link");
        }
    }, [token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password: formData.password,
                }),
            });

            const result = await res.json();

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/auth/sign-in");
                }, 2000);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <div className="mb-4 text-6xl">✅</div>
                        <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
                            Password Reset Successful!
                        </h2>
                        <p className="text-body text-dark-4 dark:text-dark-6">
                            Your password has been updated. Redirecting to sign in...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="flex flex-wrap items-center">
                <div className="w-full xl:w-1/2">
                    <div className="w-full p-4 sm:p-12.5 xl:p-15">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
                                    Reset Password
                                </h2>
                                <p className="text-body text-dark-4 dark:text-dark-6">
                                    Enter your new password below.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <InputGroup
                                type="password"
                                label="New Password"
                                className="mb-4 [&_input]:py-[15px]"
                                placeholder="Enter new password"
                                name="password"
                                handleChange={handleChange}
                                value={formData.password}
                                required
                            />

                            <InputGroup
                                type="password"
                                label="Confirm Password"
                                className="mb-6 [&_input]:py-[15px]"
                                placeholder="Confirm new password"
                                name="confirmPassword"
                                handleChange={handleChange}
                                value={formData.confirmPassword}
                                required
                            />

                            <div className="mb-4.5">
                                <button
                                    type="submit"
                                    disabled={loading || !token}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-70"
                                >
                                    Reset Password
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
                            Almost there!
                        </p>

                        <h1 className="mb-4 text-2xl font-bold text-white sm:text-heading-3">
                            Create New Password
                        </h1>

                        <p className="w-full max-w-[375px] font-medium text-white/80">
                            Choose a strong password to secure your account
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