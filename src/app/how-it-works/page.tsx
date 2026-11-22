"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Scissors,
  Sparkles,
  UserCheck,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Scissors,
    title: "Explore & Select Treatment",
    description:
      "Browse our curated menu of hair styling, skincare, bridal makeup, and holistic spa treatments with transparent pricing and duration.",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Pick Your Preferred Slot",
    description:
      "Choose your desired date and available time slot, add optional stylist notes, and submit your appointment request in seconds.",
  },
  {
    step: "03",
    icon: UserCheck,
    title: "Admin Slot Confirmation",
    description:
      "Our studio coordinator reviews and confirms your booking slot promptly—track real-time approval status right from your dashboard.",
  },
  {
    step: "04",
    icon: CreditCard,
    title: "Seamless Payment & Glow",
    description:
      "Once confirmed, complete secure payment via Stripe or enjoy your session at our flagship lounge with zero waiting time.",
  },
];

const guarantees = [
  "No upfront charge until your appointment slot is confirmed",
  "Flexible rescheduling up to 6 hours before your session",
  "100% authentic international hair & skincare products",
  "Dedicated senior stylists assigned to every confirmed slot",
];

export default function HowItWorksPage() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-slate-950 py-16 text-white sm:py-24">
      {/* Ambient Radial Mesh & Dot-Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(244,63,94,0.28),rgba(15,23,42,0))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px 24px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            Effortless Booking Flow
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            How{" "}
            <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
              SalonBook
            </span>{" "}
            Works
          </h1>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            From discovering your ideal treatment to stepping into our VIP
            styling chair—experience a smooth 4-step reservation journey.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/75 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-400/45 hover:shadow-[0_20px_50px_rgba(244,63,94,0.16)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-500/15 text-rose-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white/15 group-hover:text-rose-400/40">
                      {item.step}
                    </span>
                  </div>

                  <h2 className="mt-6 text-lg font-bold text-white">
                    {item.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee & CTA Card */}
        <div className="mt-14 rounded-3xl border border-rose-400/25 bg-linear-to-r from-rose-500/15 via-slate-900/90 to-pink-600/15 p-8 backdrop-blur-2xl sm:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
              <h3 className="text-2xl font-extrabold text-white">
                The SalonBook Peace-of-Mind Promise
              </h3>
              <ul className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-2">
                {guarantees.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-xs text-slate-200 sm:text-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:from-rose-600 hover:to-pink-700"
              >
                <span>Browse All Services</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}