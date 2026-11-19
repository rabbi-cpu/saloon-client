"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowRight,
  Clock,
  RefreshCw,
  Scissors,
  Sparkles,
  Tag,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";

export interface SalonService {
  _id: string;
  title?: string;
  name?: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image?: string;
  imageUrl?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FeaturedServices() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API_BASE}/api/services`);
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.services || [];
      setServices(list.slice(0, 6));
    } catch (err: unknown) {
      setServices([]);
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    
  }, [fetchFeatured]);

  return (
    <section
      id="services"
      className="relative isolate overflow-hidden bg-slate-950 py-20 text-white sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px 24px] [mask-image:radial-gradient(ellipse_85%_80%_at_50%_50%,#000 70%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-96 w-720px -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-600/15 blur-[130px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-rose-400" />
              Curated Treatments
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Featured{" "}
              <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
                Salon Services
              </span>
            </h2>
          </div>

          <Link
            href="/services"
            className={`${buttonVariants({ variant: "outline" })} group rounded-full border-white/15 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-md hover:border-rose-400/40 hover:bg-white/10 hover:text-rose-200`}
          >
            <span>View & Filter All Services</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-96 animate-pulse rounded-3xl border border-white/10 bg-slate-900/60 p-5"
              >
                <div className="h-44 w-full rounded-2xl bg-white/5" />
                <div className="mt-5 h-5 w-2/3 rounded bg-white/10" />
                <div className="mt-3 h-4 w-full rounded bg-white/5" />
                <div className="mt-8 h-10 w-full rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
            <Scissors className="mx-auto h-10 w-10 text-rose-400" />
            <h3 className="mt-4 text-lg font-bold text-white">
              {errorMsg ? "Backend Connection Issue" : "No Services Added Yet"}
            </h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
              {errorMsg
                ? `Could not fetch services from ${API_BASE}/api/services. Ensure your backend server is running.`
                : "No salon services found in the database."}
            </p>
            <button
              type="button"
              onClick={fetchFeatured}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry Fetching
            </button>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const serviceTitle =
                service.title || service.name || "Salon Treatment";
              const coverImg = service.image || service.imageUrl;

              return (
                <Link
                  key={service._id}
                  href={`/services/${service._id}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-400/50 hover:shadow-[0_20px_50px_rgba(244,63,94,0.18)]"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                      {coverImg ? (
                        <Image
                          src={coverImg}
                          alt={serviceTitle}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-rose-500/20 via-slate-900 to-pink-600/20">
                          <Scissors className="h-10 w-10 text-rose-400/70" />
                        </div>
                      )}
                      <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/75 px-3 py-1 text-xs font-semibold text-rose-200 backdrop-blur-md">
                        <Tag className="h-3 w-3 text-rose-400" />
                        {service.category || "Luxury"}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-1 text-lg font-bold text-white group-hover:text-rose-200">
                          {serviceTitle}
                        </h3>
                        <span className="shrink-0 text-lg font-extrabold text-rose-400">
                          ${service.price}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      <Clock className="h-3.5 w-3.5 text-rose-400" />
                      {service.duration} mins
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose-500/25 transition-all group-hover:from-rose-600 group-hover:to-pink-700">
                      <span>Book Now</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}