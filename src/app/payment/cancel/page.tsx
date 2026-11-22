"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-white">
      <div className="w-full max-w-md rounded-3xl border border-rose-400/25 bg-slate-900/85 p-8 text-center shadow-2xl backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
          <AlertCircle className="h-9 w-9" />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-white">
          Payment Cancelled
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Your payment was cancelled, so your appointment slot is still{" "}
          <span className="font-semibold text-amber-300">Unpaid / Pending</span>
          . You can complete payment anytime or cancel the booking from your
          dashboard.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700"
          >
            <CreditCard className="h-4 w-4" />
            <span>Manage Booking &amp; Pay Later</span>
          </Link>

          <Link
            href="/services"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Services</span>
          </Link>
        </div>
      </div>
    </section>
  );
}