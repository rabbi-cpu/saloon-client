"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";

const experiences = [
  {
    title: "Artisan Hair Studio",
    subtitle: "Precision Cuts, Balayage & Keratin",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80",
    span: "lg:col-span-7",
  },
  {
    title: "Botanical Skin Lab",
    subtitle: "24K Gold & Hydra-Glow Facials",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80",
    span: "lg:col-span-5",
  },
  {
    title: "Royal Bridal Lounge",
    subtitle: "Bespoke HD & Airbrush Makeovers",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
    span: "lg:col-span-5",
  },
  {
    title: "Holistic Spa Sanctuary",
    subtitle: "Aromatherapy & Deep Tissue Rituals",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
    span: "lg:col-span-7",
  },
];

export default function SalonExperiences() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 py-16 text-white sm:py-22">
      {/* Subtle Ambient Rose Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-96 w-760px -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-600/15 blur-[140px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/6 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            Signature Experiences
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Crafted for{" "}
            <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
              Total Indulgence
            </span>
          </h2>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Step into four specialized beauty zones designed to rejuvenate your
            hair, skin, and senses.
          </p>
        </div>

        {/* Asymmetric Luxury Image Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {experiences.map((item) => (
            <Link
              key={item.title}
              href="/services"
              className={`group relative h-72 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 sm:h-80 ${item.span}`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Rich Dark Gradient Overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/35 to-transparent transition-opacity duration-300 group-hover:opacity-90"
              />

              {/* Card Text & Floating Action Arrow */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 sm:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    {item.title}
                  </h3>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:border-rose-400 group-hover:bg-rose-500">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}