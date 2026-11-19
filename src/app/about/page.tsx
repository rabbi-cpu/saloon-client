"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Clock,
  HeartHandshake,
  Quote,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const perks = [
  {
    icon: Award,
    title: "Certified Master Stylists",
    description:
      "Every hair, skincare, and bridal artist is vetted for years of luxury salon expertise.",
  },
  {
    icon: Clock,
    title: "Zero Double-Booking",
    description:
      "Real-time slot validation ensures your reserved chair and stylist are ready the moment you arrive.",
  },
  {
    icon: ShieldCheck,
    title: "Stripe-Secured Payments",
    description:
      "Pay safely online only after your appointment is confirmed, with instant digital receipts.",
  },
  {
    icon: HeartHandshake,
    title: "100% Organic & Safe Care",
    description:
      "We use dermatologically tested, cruelty-free international beauty products for every ritual.",
  },
];

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

export default function AboutPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-950 py-16 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(244,63,94,0.28),rgba(15,23,42,0))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px 24px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Brand Story Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200">
            <Scissors className="h-3.5 w-3.5 text-rose-400" />
            About SalonBook
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Where Modern Tech Meets{" "}
            <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
              Timeless Beauty
            </span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            SalonBook was built to eliminate long salon waiting queues and
            uncertain schedules—connecting discerning guests with top beauty
            professionals through real-time slot reservation and Stripe-verified
            payments.
          </p>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-20">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200">
              <Sparkles className="h-3.5 w-3.5 text-rose-400" />
              Why Choose Us
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-4xl">
              The SalonBook Standard
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-rose-400/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/25 bg-rose-500/15 text-rose-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-white">
                    {perk.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client Reviews Section */}
        <div className="mt-24">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              Verified Client Reviews
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-4xl">
              Loved by Our Guests
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
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
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/services"
            className={`${buttonVariants()} group rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-8 py-6 text-sm font-semibold text-white shadow-xl shadow-rose-500/30 hover:from-rose-600 hover:to-pink-700`}
          >
            <span>Explore Our Services</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}