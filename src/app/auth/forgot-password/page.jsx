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
        router.push(`/auth/email-sent?email=${encodeURIComponent(email)}`);
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
                  Forgot Password?
                </h1>
                <p className="text-gray-600">
                  Enter the email address associated with your account, and
                  we'll send you a link to reset your password.
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
                    Send Mail
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

          {/* Right Side - Image */}
          <div className="hidden w-full items-center justify-center from-blue-50 to-indigo-100 xl:flex xl:w-3/5">
            <Image
              src="/images/cover/singinCover.svg"
              alt="Forgot Password Cover"
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
