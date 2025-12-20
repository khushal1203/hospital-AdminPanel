"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { ButtonLoader } from "../ui/LoadingSpinner";

const SigninWithPassword = () => {
  const router = useRouter();

  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    
    if (savedEmail && savedPassword) {
      setData({
        email: savedEmail,
        password: savedPassword,
        remember: true,
      });
    }
  }, []);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_END_POINT}/auth/sign-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      // ✅ JWT TOKEN
      const token = result.data.token;
      const user = result.data.user;

      // ✅ STORE TOKEN IN COOKIE
      document.cookie = `token=${token}; path=/; ${data.remember ? "max-age=2592000" : ""
        }`;

      // ✅ STORE USER DATA IN LOCALSTORAGE (including role)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ SAVE CREDENTIALS IF REMEMBER ME IS CHECKED
      if (data.remember) {
        localStorage.setItem("rememberedEmail", data.email);
        localStorage.setItem("rememberedPassword", data.password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      // ✅ REDIRECT TO ROOT ("/") AS REQUESTED
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

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px] [&_input]:pr-1"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          checked={data.remember}
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mb-6">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-4 font-semibold text-white transition-all duration-200 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <ButtonLoader />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </div>
    </form>
  );
};

export default SigninWithPassword;
