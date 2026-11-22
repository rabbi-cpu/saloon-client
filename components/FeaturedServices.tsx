"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  ArrowRight,
  Clock,
  Scissors,
  Sparkles,
  Tag,
} from "lucide-react";

interface SalonService {
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

const FALLBACK_SERVICES: SalonService[] = [
  {
    _id: "signature-hair-spa",
    title: "Signature Keratin & Silk Hair Spa",
    description:
      "Deep nourishing botanical keratin infusion with steam therapy for frizz-free, luminous shine.",
    price: 85,
    duration: 75,
    category: "Hair",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "hydra-gold-facial",
    title: "24K Hydra-Glow Radiance Facial",
    description:
      "Clinical ultrasonic hydration paired with pure rose-quartz lymphatic sculpting for instant glass-skin glow.",
    price: 110,
    duration: 60,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "luxury-bridal-glam",
    title: "Velvet Rose Editorial & Bridal Glam",
    description:
      "Airbrush HD complexion artistry, custom lash styling, and soft-glam hair updo tailored to your event.",
    price: 165,
    duration: 120,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
  },
];

export default function FeaturedServices() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedServices() {
      try {
        const res = await axios.get(`${API_BASE}/api/services`, {
          timeout: 4000,
        });
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.services || [];

        if (isMounted) {
          if (list.length > 0) {
            setServices(list.slice(0, 3));
            setIsFallback(false);
          } else {
            setServices(FALLBACK_SERVICES);
            setIsFallback(true);
          }
        }
      } catch {
        if (isMounted) {
          setServices(FALLBACK_SERVICES);
          setIsFallback(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFeaturedServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative isolate bg-slate-950 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/6 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200">
              <Sparkles className="h-3.5 w-3.5 text-rose-400" />
              Curated Treatments
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Featured{" "}
              <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
                Salon Services
              </span>
            </h2>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/6 px-5 py-3 text-xs font-semibold text-white transition hover:border-rose-400/50 hover:bg-white/10 sm:self-auto"
          >
            <span>View All Services</span>
            <ArrowRight className="h-4 w-4 text-rose-400" />
          </Link>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-96 animate-pulse rounded-3xl border border-white/10 bg-slate-900/60 p-5"
              >
                <div className="h-48 w-full rounded-2xl bg-white/5" />
                <div className="mt-5 h-5 w-2/3 rounded bg-white/10" />
                <div className="mt-3 h-4 w-full rounded bg-white/5" />
                <div className="mt-8 h-10 w-full rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const serviceTitle =
                service.title || service.name || "Salon Treatment";
              const coverImg = service.image || service.imageUrl;
              const targetHref = isFallback
                ? "/services"
                : `/services/${service._id}`;

              return (
                <Link
                  key={service._id}
                  href={targetHref}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-400/50 hover:shadow-[0_20px_50px_rgba(244,63,94,0.18)]"
                >
                  <div>
                    <div className="relative h-52 w-full overflow-hidden bg-slate-800">
                      {coverImg ? (
                        <Image
                          src={coverImg}
                          alt={serviceTitle}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                      <span>Book Slot</span>
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