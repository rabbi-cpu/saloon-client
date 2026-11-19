"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Quote, Sparkles, Star } from "lucide-react";
import { authClient, dashboardPath } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";

const reviews = [
  {
    name: "Nusrat Jahan",
    role: "Bridal Client",
    text: "Booking my pre-bridal facial and hair spa took less than a minute. Zero waiting time and super smooth Stripe payment!",
  },
  {
    name: "Tahmid Hasan",
    role: "Regular Member",
    text: "The live slot confirmation is a game changer. I always know when my appointment is approved right from my dashboard.",
  },
  {
    name: "Farhana Akter",
    role: "Skincare Enthusiast",
    text: "Loved the 24K Gold Facial! The stylists are true professionals and the entire booking experience feels ultra-premium.",
  },
];

export default function TestimonialsAndCta() {
  const { data: session } = authClient.useSession();
  const user = session?.user as { name: string; role?: string } | undefined;

  return (
    <section
      id="reviews"
      className="relative isolate overflow-hidden bg-slate-950 pt-16 pb-24 text-white sm:pt-20 sm:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px 24px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-1/2 -z-10 h-80 w-700px -translate-x-1/2 rounded-full bg-rose-600/20 blur-[130px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Testimonials Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            Verified Client Stories
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Loved by{" "}
            <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
              Thousands
            </span>{" "}
            of Guests
          </h2>
        </div>

        {/* Review Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/70 p-7 backdrop-blur-xl transition-all duration-300 hover:border-rose-400/35"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-rose-400/30" />
                </div>

                <p className="mt-5 text-sm leading-relaxed text-slate-300">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-rose-500 to-pink-600 text-sm font-bold text-white">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{rev.name}</p>
                  <p className="text-xs text-rose-300">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final Luxury CTA Banner */}
        <div className="relative mt-20 overflow-hidden rounded-2rem border border-rose-400/30 bg-linear-to-r from-rose-500/20 via-slate-900/90 to-pink-600/20 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-rose-200">
            <Sparkles className="h-3.5 w-3.5 text-rose-300" />
            Your Glow Awaits
          </span>
          <h3 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to Transform Your Look?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
            Book your next hair, skin, or spa session in seconds with instant
            slot confirmation and Stripe-protected checkout.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/services"
              className={`${buttonVariants()} group rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-8 py-6 text-sm font-semibold text-white shadow-xl shadow-rose-500/30 hover:from-rose-600 hover:to-pink-700`}
            >
              <span>Book an Appointment</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {user ? (
              <Link
                href={dashboardPath(user.role)}
                className={`${buttonVariants({ variant: "outline" })} rounded-full border-white/20 bg-white/10 px-7 py-6 text-sm font-semibold text-white hover:bg-white/15`}
              >
                Open Dashboard
              </Link>
            ) : (
              <Link
                href="/signup"
                className={`${buttonVariants({ variant: "outline" })} rounded-full border-white/20 bg-white/10 px-7 py-6 text-sm font-semibold text-white hover:bg-white/15`}
              >
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}