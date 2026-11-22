"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Scissors,
  Sparkles,
  X,
} from "lucide-react";

import { authClient, dashboardPath } from "@/lib/auth-client";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot Password Modal States
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  async function handleEmailSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter both your email and password.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      const loggedUser = data?.user as
        | { name?: string; role?: string }
        | undefined;
      toast.success(
        `Welcome back${loggedUser?.name ? `, ${loggedUser.name}` : ""}!`
      );

      const destination = callbackUrl || dashboardPath(loggedUser?.role);
      router.push(destination);
      router.refresh();
    } catch {
      toast.error("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/",
      });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error("Please enter your registered email address.");
      return;
    }

    setResetLoading(true);
    try {
      const clientAny = authClient as unknown as {
        forgetPassword?: (opts: {
          email: string;
          redirectTo?: string;
        }) => Promise<{ error?: { message?: string } }>;
      };

      if (typeof clientAny.forgetPassword === "function") {
        const res = await clientAny.forgetPassword({
          email: resetEmail.trim(),
          redirectTo: "/reset-password",
        });

        if (res?.error) {
          toast.error(
            res.error.message || "Could not send password reset email."
          );
          return;
        }
      }

      toast.success(
        "If an account exists for this email, a password reset link has been sent!"
      );
      setForgotOpen(false);
      setResetEmail("");
    } catch {
      toast.error("Failed to process password reset request.");
    } finally {
      setResetLoading(false);
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
            Welcome Back
          </h1>
          <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
            Sign in to manage your salon appointments or admin dashboard
          </p>
        </div>

        {/* Google Login Button */}
        <div className="mt-7">
          <button
            type="button"
            onClick={handleGoogleSignIn}
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
            or sign in with email
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="signin-email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-rose-400" />
              <input
                id="signin-email"
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
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="signin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setForgotOpen(true);
                }}
                className="text-xs font-semibold text-rose-400 transition hover:text-rose-300"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-rose-400" />
              <input
                id="signin-password"
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
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:from-rose-600 hover:to-pink-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-rose-400 hover:text-rose-300"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleForgotPassword}
            className="w-full max-w-md space-y-4 rounded-3xl border border-white/15 bg-slate-900 p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <KeyRound className="h-5 w-5 text-rose-400" />
                Reset Password
              </h3>
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter your registered email address and we&apos;ll send you a
              link to reset your password.
            </p>

            <div>
              <label
                htmlFor="reset-email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-rose-400" />
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/15 bg-slate-950 py-3 pr-4 pl-10 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={resetLoading}
                className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700 disabled:opacity-60"
              >
                {resetLoading && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
          Loading sign-in...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}