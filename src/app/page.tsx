"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import SalonExperiences from "@/components/SalonExperiences";
import FeaturedServices from "@/components/FeaturedServices";
import SalonLookbook from "@/components/SalonLookbook";
import { authClient, dashboardPath } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user as { name: string; role?: string } | undefined;

  return (
    <div className="bg-slate-950 text-white">
      
      <HeroBanner />
      <SalonExperiences />
      <FeaturedServices />
      <SalonLookbook />
      <section className="relative isolate overflow-hidden bg-slate-950 pt-6 pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2rem border border-rose-400/30 bg-linear-to-r from-rose-500/20 via-slate-900/90 to-pink-600/20 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-rose-200">
              <Sparkles className="h-3.5 w-3.5 text-rose-300" />
              Your Glow Awaits
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Look?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
              Browse all treatments, filter by category, and reserve your slot
              with instant confirmation.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/services"
                className={`${buttonVariants()} group rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-8 py-6 text-sm font-semibold text-white shadow-xl shadow-rose-500/30 hover:from-rose-600 hover:to-pink-700`}
              >
                <span>Explore Services</span>
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
    </div>
  );
}