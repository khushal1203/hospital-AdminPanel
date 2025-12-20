"use client";

import { EmailIcon, PasswordIcon, UserIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";

const SignupWithPassword = () => {
    const router = useRouter();

    const [data, setData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        remember: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // ✅ Client-side password match
        if (data.password !== data.confirmPassword) {
            setError("Password and Confirm Password do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_END_POINT}/auth/sign-up`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fullName: data.fullName,
                        email: data.email,
                        password: data.password,
                        confirmPassword: data.confirmPassword,
                    }),
                }
            );

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Signup failed");
            }

            // ✅ JWT TOKEN (backend se)
            if (result.data?.token) {
                if (data.remember) {
                    localStorage.setItem("token", result.data.token);
                } else {
                    sessionStorage.setItem("token", result.data.token);
                }
            }

            // ✅ Redirect after signup
            router.push("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <p className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            {/* Full Name */}
            <InputGroup
                type="text"
                label="Full Name"
                className="mb-4 [&_input]:py-[15px]"
                placeholder="Enter your full name"
                name="fullName"
                handleChange={handleChange}
                value={data.fullName}
                icon={<UserIcon />}
            />

            {/* Email */}
            <InputGroup
                type="email"
                label="Email"
                className="mb-4 [&_input]:py-[15px]"
                placeholder="Enter your email"
                name="email"
                handleChange={handleChange}
                value={data.email}
                icon={<EmailIcon />}
            />

            {/* Password */}
            <InputGroup
                type="password"
                label="Password"
                className="mb-4 [&_input]:py-[15px]"
                placeholder="Create a password"
                name="password"
                handleChange={handleChange}
                value={data.password}
            />

            {/* Confirm Password */}
            <InputGroup
                type="password"
                label="Confirm Password"
                className="mb-5 [&_input]:py-[15px]"
                placeholder="Confirm your password"
                name="confirmPassword"
                handleChange={handleChange}
                value={data.confirmPassword}
            />

            <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
                <Checkbox
                    label="Remember me"
                    name="remember"
                    withIcon="check"
                    minimal
                    radius="md"
                    onChange={(e) =>
                        setData({
                            ...data,
                            remember: e.target.checked,
                        })
                    }
                />

                <Link
                    href="/auth/sign-in"
                    className="hover:text-primary dark:text-white dark:hover:text-primary"
                >
                    Already have an account?
                </Link>
            </div>

            <div className="mb-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 p-4 font-semibold text-white transition-all duration-200 hover:from-pink-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Creating Account..." : "Create Account"}
                </button>
            </div>
        </form>
    );
};

export default SignupWithPassword;
