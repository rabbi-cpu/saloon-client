"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Scissors,
  Sparkles,
  User,
} from "lucide-react";

import { authClient, dashboardPath } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Could not create account.");
        return;
      }

      const createdUser = data?.user as
        | { name?: string; role?: string }
        | undefined;
      toast.success("Account created! Welcome to SalonBook.");
      router.push(dashboardPath(createdUser?.role));
      router.refresh();
    } catch {
      toast.error("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Google sign-up failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6">
      {/* Ambient Radial Mesh & Dot-Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(244,63,94,0.3),rgba(15,23,42,0))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px 24px]"
      />

      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/80 p-7 shadow-2xl backdrop-blur-2xl sm:p-9">
        {/* Brand Header */}
        <div className="text-center">
          <Link
            href="/"
            className="mx-auto inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30">
              <Scissors className="h-4 w-4" />
            </span>
            <span>
              Salon
              <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
                Book
              </span>
            </span>
          </Link>

          <h1 className="mt-5 text-2xl font-extrabold text-white">
            Create Your Account
          </h1>
          <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
            Join SalonBook to reserve luxury treatments in seconds
          </p>
        </div>

        {/* Google Sign-Up Button */}
        <div className="mt-7">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:border-rose-400/40 hover:bg-white/10 disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 5c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.31 0 3.25 2.69 1.28 6.61l3.66 2.84C5.8 6.86 8.65 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z"
                />
                <path
                  fill="#FBBC05"
                  d="M4.94 14.55A7.18 7.18 0 0 1 4.56 12c0-.89.15-1.75.38-2.55L1.28 6.61A11.97 11.97 0 0 0 0 12c0 1.93.46 3.75 1.28 5.39l3.66-2.84z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.08.72-2.45 1.16-4.23 1.16-3.35 0-6.2-1.86-7.06-4.45l-3.66 2.84C3.25 21.31 7.31 24 12 24z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            or register with email
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label
              htmlFor="signup-name"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-rose-400" />
              <input
                id="signup-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pr-4 pl-10 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-rose-400" />
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pr-4 pl-10 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-rose-400" />
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pr-11 pl-10 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Must be at least 8 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:from-rose-600 hover:to-pink-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-rose-400 hover:text-rose-300"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </section>
  );
}