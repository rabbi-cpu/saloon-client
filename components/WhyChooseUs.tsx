"use client";

import { Award, Clock, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

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

export default function WhyChooseUs() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 py-20 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px 24px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            The SalonBook Standard
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Why Clients Trust{" "}
            <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
              SalonBook
            </span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 backdrop-blur-xl transition-all duration-300 hover:border-rose-400/40 hover:bg-slate-900/90"
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
    </section>
  );
}