"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  ArrowUpDown,
  Clock,
  DollarSign,
  RotateCcw,
  Scissors,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
} from "lucide-react";

interface SalonService {
  _id?: string;
  id?: string;
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

type PriceFilter = "all" | "under-50" | "50-100" | "over-100";
type SortOption = "default" | "price-asc" | "price-desc" | "duration-asc";

export default function ServicesCatalogPage() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  useEffect(() => {
    let isMounted = true;
    async function fetchServices() {
      try {
        const res = await axios.get(`${API_BASE}/api/services`);
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.services || res.data?.data || [];
        if (isMounted) setServices(list);
      } catch {
        if (isMounted) setServices([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(services.map((s) => s.category).filter(Boolean))
      ),
    ];
  }, [services]);

  const filteredServices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = services.filter((s) => {
      const title = (s.title || s.name || "").toLowerCase();
      const desc = (s.description || "").toLowerCase();
      const cat = (s.category || "").toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        desc.includes(query) ||
        cat.includes(query);

      const matchesCategory =
        selectedCategory === "All" || s.category === selectedCategory;

      const price = Number(s.price) || 0;
      let matchesPrice = true;
      if (priceFilter === "under-50") matchesPrice = price < 50;
      else if (priceFilter === "50-100")
        matchesPrice = price >= 50 && price <= 100;
      else if (priceFilter === "over-100") matchesPrice = price > 100;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === "price-asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "duration-asc") {
      return [...filtered].sort((a, b) => a.duration - b.duration);
    }
    return filtered;
  }, [services, searchTerm, selectedCategory, priceFilter, sortBy]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "All" ||
    priceFilter !== "all" ||
    sortBy !== "default";

  function handleResetFilters() {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceFilter("all");
    setSortBy("default");
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-slate-950 py-16 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(244,63,94,0.28),rgba(15,23,42,0))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px 24px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            Signature Treatments
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Explore Our{" "}
            <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
              Salon Services
            </span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Filter by category, budget, or duration and reserve your ideal time
            slot.
          </p>
        </div>

        {/* Advanced Filter & Sort Panel */}
        <div className="mt-10 space-y-4 rounded-3xl border border-white/10 bg-slate-900/75 p-5 backdrop-blur-2xl sm:p-6">
          {/* Top Row: Search, Price Range, Sort */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {/* Search Box */}
            <div className="relative md:col-span-5">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hair, facial, spa, massage..."
                className="w-full rounded-xl border border-white/15 bg-slate-950/90 py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-slate-400 focus:border-rose-400 focus:outline-none"
              />
            </div>

            {/* Price Range Filter */}
            <div className="relative md:col-span-4">
              <SlidersHorizontal className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-rose-400" />
              <select
                aria-label="Filter by price range"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
                className="w-full appearance-none rounded-xl border border-white/15 bg-slate-950/90 py-2.5 pr-8 pl-10 text-sm text-white focus:border-rose-400 focus:outline-none"
              >
                <option value="all">All Price Ranges</option>
                <option value="under-50">Under $50</option>
                <option value="50-100">$50 – $100</option>
                <option value="over-100">Over $100 (Luxury)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative md:col-span-3">
              <ArrowUpDown className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-amber-400" />
              <select
                aria-label="Sort services"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full appearance-none rounded-xl border border-white/15 bg-slate-950/90 py-2.5 pr-8 pl-10 text-sm text-white focus:border-rose-400 focus:outline-none"
              >
                <option value="default">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration-asc">Duration: Shortest</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Pills & Result Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-linear-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25"
                      : "border border-white/10 bg-white/4 text-slate-300 hover:border-rose-400/40 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>
                Showing{" "}
                <strong className="text-white">{filteredServices.length}</strong>{" "}
                of {services.length} treatments
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 rounded-full border border-rose-400/35 bg-rose-500/15 px-3 py-1 font-semibold text-rose-200 transition hover:bg-rose-500/25"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-88 animate-pulse rounded-3xl border border-white/10 bg-slate-900/60"
              />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center">
            <Scissors className="mx-auto h-10 w-10 text-rose-400" />
            <h2 className="mt-4 text-lg font-bold text-white">
              No Matching Treatments
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              No services matched your current search or filter criteria.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-500/25"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => {
              const serviceId = service._id || service.id;
              const title =
                service.title || service.name || "Signature Treatment";
              const img = service.image || service.imageUrl;

              return (
                <article
                  key={serviceId || title}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-rose-400/40"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-slate-800">
                    {img ? (
                      <Image
                        src={img}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-rose-500/20 via-slate-900 to-pink-600/20">
                        <Scissors className="h-10 w-10 text-rose-400/70" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/80 px-3 py-1 text-[11px] font-semibold text-rose-200 backdrop-blur-md">
                      <Tag className="h-3 w-3 text-rose-400" />
                      {service.category || "Salon"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-400">
                      {service.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                      <span className="inline-flex items-center gap-1 text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-rose-400" />
                        {service.duration} mins
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-base font-extrabold text-rose-300">
                        <DollarSign className="h-4 w-4 text-rose-400" />
                        {service.price}
                      </span>
                    </div>

                    <Link
                      href={serviceId ? `/services/${serviceId}` : "/services"}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:from-rose-600 hover:to-pink-700"
                    >
                      View Details &amp; Book
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}