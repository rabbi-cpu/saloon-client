"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  Star,
} from "lucide-react";

import { authClient, dashboardPath } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";

const HERO_SLIDES = [
  {
    id: 1,
    badge: "Luxury Hair & Styling Studio",
    titlePrefix: "Redefine Your Style with",
    highlight: "Signature Hair Artistry",
    description:
      "Precision cuts, keratin smoothing, and bespoke coloring crafted by senior stylists in a serene sanctuary.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: 2,
    badge: "Advanced Skin & Radiance Rituals",
    titlePrefix: "Reveal Your Natural Glow with",
    highlight: "24K Botanical Facials",
    description:
      "Dermatologist-approved organic treatments designed to hydrate, rejuvenate, and illuminate your skin.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: 3,
    badge: "Bridal & Holistic Spa Lounge",
    titlePrefix: "Unwind & Transform in",
    highlight: "Pure Serenity & Care",
    description:
      "Reserve your exact time slot online in seconds with zero waiting lines and Stripe-secured checkout.",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1920&q=80",
  },
];

export default function HeroBanner() {
  const { data: session } = authClient.useSession();
  const user = session?.user as { name: string; role?: string } | undefined;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeSlide = HERO_SLIDES[currentIndex];


  

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative isolate flex min-h-[82vh] items-center overflow-hidden bg-slate-950 py-20 text-white"
    >
      {/* Dynamic Background Salon Images with Smooth Crossfade */}
      {HERO_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-20 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
         <Image
            src={slide.image}
            alt={slide.highlight}
            fill
            sizes="100vw"
            priority={idx === 0}
            className={`object-cover object-center transition-transform duration-6000ms ease-out ${
              idx === currentIndex ? "scale-105" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Dark Luxury Gradient Overlay for Crisp Text Readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-slate-950/95 via-slate-950/80 to-slate-950/45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t from-slate-950 to-transparent"
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl space-y-7">
          {/* Dynamic Slide Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-rose-400/35 bg-slate-950/60 px-4 py-1.5 text-xs font-semibold text-rose-200 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
            </span>
            <span>{activeSlide.badge}</span>
          </div>

          {/* Dynamic Headline & Description */}
          <div key={activeSlide.id} className="space-y-4 transition-all duration-500">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.6rem] lg:leading-[1.12]">
              {activeSlide.titlePrefix}{" "}
              <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
                {activeSlide.highlight}
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
              {activeSlide.description}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href="/services"
              className={`${buttonVariants()} group rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-8 py-6 text-sm font-semibold text-white shadow-xl shadow-rose-500/30 transition-all duration-300 hover:scale-[1.02] hover:from-rose-600 hover:to-pink-700`}
            >
              <Sparkles className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              Explore Services
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {user ? (
              <Link
                href={dashboardPath(user.role)}
                className={`${buttonVariants({ variant: "outline" })} rounded-full border-white/25 bg-slate-950/50 px-7 py-6 text-sm font-semibold text-white backdrop-blur-md hover:border-rose-400/50 hover:bg-white/10`}
              >
                <LayoutDashboard className="mr-2 h-4 w-4 text-rose-300" />
                {user.role === "admin" ? "Admin Dashboard" : "My Appointments"}
              </Link>
            ) : (
              <Link
                href="/how-it-works"
                className={`${buttonVariants({ variant: "outline" })} rounded-full border-white/25 bg-slate-950/50 px-7 py-6 text-sm font-semibold text-white backdrop-blur-md hover:border-rose-400/50 hover:bg-white/10`}
              >
                How It Works
              </Link>
            )}
          </div>

          {/* Slider Controls & Trust Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-6">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xl font-bold text-white">2.5k+</p>
                <p className="text-xs text-slate-300">Happy Guests</p>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div>
                <p className="flex items-center gap-1 text-xl font-bold text-white">
                  4.9
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </p>
                <p className="text-xs text-slate-300">Client Rating</p>
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </section>
  );
}