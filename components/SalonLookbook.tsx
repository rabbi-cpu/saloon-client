"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Crown, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const highlights = [
  "Private VIP styling suites with calming aromatherapy",
  "100% authentic international organic hair & skin formulas",
  "Complimentary herbal infusions during every session",
  "Strict hospital-grade tool sterilization before each guest",
];

export default function SalonLookbook() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 py-16 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px 24px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Visual Collage */}
          <div className="relative grid grid-cols-2 gap-4 lg:col-span-6">
            <div className="relative h-72 overflow-hidden rounded-3xl border border-white/15 sm:h-88">
              <Image
                src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Salon Interior"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            <div className="relative mt-8 h-72 overflow-hidden rounded-3xl border border-rose-400/25 sm:h-88">
              <Image
                src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80"
                alt="Master Stylist Session"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            {/* Floating Glass Badge */}
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/85 px-5 py-3 shadow-2xl backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-rose-500 to-pink-600 text-white">
                <Crown className="h-5 w-5" />
              </div>
              <div className="whitespace-nowrap">
                <p className="text-xs font-bold text-white">
                  Award-Winning Lounge
                </p>
                <p className="text-[11px] text-rose-300">
                  Dhaka&apos;s Premier Beauty Sanctuary
                </p>
              </div>
            </div>
          </div>

          {/* Right Editorial Content */}
          <div className="space-y-6 lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/6 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200">
              <Sparkles className="h-3.5 w-3.5 text-rose-400" />
              The SalonBook Sanctuary
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Designed for{" "}
              <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
                Unrushed Luxury
              </span>{" "}
              & Personal Care
            </h2>

            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Every detail of our studio is curated so you feel refreshed the
              moment you walk in. Combine effortless online slot booking with a
              calming, world-class salon atmosphere.
            </p>

            <ul className="space-y-3 pt-1">
              {highlights.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-sm text-slate-200"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href="/services"
                className={`${buttonVariants()} group rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-7 py-6 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700`}
              >
                <span>Reserve Your Experience</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}