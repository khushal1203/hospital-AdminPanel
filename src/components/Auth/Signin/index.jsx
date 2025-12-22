import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
      <SigninWithPassword />

      <div className="mt-6 text-center">
        <p>
          By logging in or signing up using the options above, you agree to
          Genify Terms & Conditions and Privacy Policy.
          {/* <Link href="/auth/sign-up" className="text-primary">
            Sign Up
          </Link> */}
        </p>
      </div>
    </>
  );
}
