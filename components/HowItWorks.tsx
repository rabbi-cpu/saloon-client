"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { authClient, dashboardPath } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Explore Salon Services",
    description:
      "Browse curated hair, facial, makeup, and spa packages with transparent pricing and duration.",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Pick a Conflict-Free Slot",
    description:
      "Select your preferred date and available appointment time in seconds without waiting lines.",
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Instant Confirmation",
    description:
      "Track live booking status from your dashboard with guaranteed slot reservation.",
  },
  {
    step: "04",
    icon: CreditCard,
    title: "Secure Stripe Checkout",
    description:
      "Once confirmed, complete your payment effortlessly via Stripe and view digital receipts anytime.",
  },
];

export default function HowItWorks() {
  const { data: session } = authClient.useSession();
  const user = session?.user as
    | { name: string; role?: string }
    | undefined;

  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-slate-950 py-20 text-white sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px 24px] [mask-image:radial-gradient(ellipse_85%_80%_at_50%_50%,#000 70%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-72 w-720px -translate-x-1/2 rounded-full bg-linear-to-r from-rose-600/15 via-pink-500/20 to-amber-500/10 blur-[130px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            Simple 4-Step Process
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            How{" "}
            <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
              SalonBook
            </span>{" "}
            Works
          </h2>

          <p className="mt-3 text-base text-slate-300">
            From discovering luxury treatments to secure online checkout—book
            your next salon visit effortlessly.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/65 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-rose-400/40 hover:bg-slate-900/90 hover:shadow-[0_20px_45px_rgba(244,63,94,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white/15 transition-colors group-hover:text-rose-400/40">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-white group-hover:text-rose-200">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 h-0.5 w-10 rounded-full bg-rose-500/40 transition-all duration-300 group-hover:w-full group-hover:bg-linear-to-r group-hover:from-rose-500 group-hover:to-pink-500" />
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/ px-6 py-5 backdrop-blur-xl sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <ShieldCheck className="h-5 w-5 shrink-0 text-rose-400" />
            <span>
              {user
                ? `Welcome back, ${user.name}! Open your personalized ${
                    user.role === "admin" ? "Admin" : "Customer"
                  } workspace.`
                : "Ready to pamper yourself? Browse our treatments and reserve your slot today."}
            </span>
          </div>

          {user ? (
            <Link
              href={dashboardPath(user.role)}
              className={`${buttonVariants()} shrink-0 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-6 py-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700`}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {user.role === "admin" ? "Go to Admin Panel" : "My Appointments"}
            </Link>
          ) : (
            <Link
              href="/services"
              className={`${buttonVariants()} group shrink-0 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-6 py-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700`}
            >
              <span>Browse Services</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}