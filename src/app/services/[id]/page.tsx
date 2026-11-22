"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  Scissors,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

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

interface ServiceReview {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
  "07:00 PM",
  "08:15 PM",
];

function getTodayLocal(): string {
  return typeof window !== "undefined"
    ? new Date().toLocaleDateString("en-CA")
    : "";
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const rawId = params?.id;
  const serviceId = Array.isArray(rawId) ? rawId[0] : rawId;

  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as
    | { id?: string; name: string; email?: string; role?: string }
    | undefined;

  const [service, setService] = useState<SalonService | null>(null);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [minDate] = useState<string>(getTodayLocal);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayLocal);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  // Fetch single service details & verified reviews from backend
  useEffect(() => {
    let isMounted = true;

    async function fetchServiceAndReviews() {
      if (!serviceId) {
        if (isMounted) {
          setLoading(false);
          setErrorMsg("Invalid service ID.");
        }
        return;
      }

      try {
        const [serviceRes, reviewRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/api/services/${serviceId}`),
          axios.get(`${API_BASE}/api/reviews/${serviceId}`),
        ]);

        if (!isMounted) return;

        if (serviceRes.status === "fulfilled") {
          const fetchedService =
            serviceRes.value.data?.data ||
            serviceRes.value.data?.service ||
            serviceRes.value.data;

          if (fetchedService && fetchedService._id) {
            setService(fetchedService);
            setErrorMsg(null);
          } else {
            setService(null);
            setErrorMsg("Service details could not be found.");
          }
        } else {
          setService(null);
          const err = serviceRes.reason;
          const message =
            axios.isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : "Failed to load service details from server.";
          setErrorMsg(message);
        }

        if (reviewRes.status === "fulfilled") {
          const rawReviews = Array.isArray(reviewRes.value.data)
            ? reviewRes.value.data
            : reviewRes.value.data?.reviews || [];
          setReviews(rawReviews);
        }
      } catch {
        if (isMounted) {
          setService(null);
          setErrorMsg("Failed to load service details from server.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchServiceAndReviews();

    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  // Submit appointment booking request
  async function handleBookingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in first to book an appointment.");
      router.push(`/signin?callbackUrl=/services/${serviceId}`);
      return;
    }

    if (user.role === "admin") {
      toast.error("Admin accounts cannot submit customer booking requests.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select both a preferred date and a time slot.");
      return;
    }

    setBookingLoading(true);

    try {
      await axios.post(
        `${API_BASE}/api/appointments`,
        {
          serviceId: service?._id || serviceId,
          date: selectedDate,
          timeSlot: selectedTime,
          time: selectedTime,
          notes: notes.trim() || undefined,
        },
        { withCredentials: true }
      );

      toast.success(
        "Appointment requested! Complete Stripe payment in your dashboard to auto-confirm."
      );
      router.push("/dashboard");
    } catch (err: unknown) {
      const serverMsg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Could not submit appointment request. Please try another slot.";
      toast.error(serverMsg);
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-9 w-44 animate-pulse rounded-full bg-white/10" />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="h-460px animate-pulse rounded-3xl border border-white/10 bg-slate-900/60 lg:col-span-7" />
            <div className="h-460px animate-pulse rounded-3xl border border-white/10 bg-slate-900/60 lg:col-span-5" />
          </div>
        </div>
      </section>
    );
  }

  if (errorMsg || !service) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="max-w-md rounded-3xl border border-white/15 bg-slate-900/80 p-8 text-center backdrop-blur-xl">
          <Scissors className="mx-auto h-10 w-10 text-rose-400" />
          <h1 className="mt-4 text-xl font-bold text-white">
            Service Not Found
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {errorMsg ||
              "The treatment you are looking for may have been removed or is unavailable."}
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Services
          </Link>
        </div>
      </section>
    );
  }

  const serviceTitle = service.title || service.name || "Salon Treatment";
  const coverImg = service.image || service.imageUrl;

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-slate-950 py-14 text-white sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(244,63,94,0.28),rgba(15,23,42,0))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px 24px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 backdrop-blur-md transition hover:border-rose-400/40 hover:text-rose-200"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-rose-400" />
          <span>Back to Services</span>
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Service Details + Verified Client Reviews */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 backdrop-blur-2xl lg:col-span-7">
            <div className="relative h-72 w-full overflow-hidden bg-slate-800 sm:h-88">
              {coverImg ? (
                <Image
                  src={coverImg}
                  alt={serviceTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-rose-500/25 via-slate-900 to-pink-600/20">
                  <Scissors className="h-14 w-14 text-rose-400/70" />
                </div>
              )}

              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/80 px-3.5 py-1.5 text-xs font-semibold text-rose-200 backdrop-blur-md">
                <Tag className="h-3.5 w-3.5 text-rose-400" />
                {service.category || "Luxury Treatment"}
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {serviceTitle}
                </h1>
                <div className="inline-flex items-center gap-1 rounded-2xl border border-rose-400/30 bg-rose-500/15 px-4 py-2 text-xl font-extrabold text-rose-300">
                  <DollarSign className="h-5 w-5 text-rose-400" />
                  <span>{service.price}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-white/10 pb-5 text-xs font-medium text-slate-300">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/s px-3.5 py-1.5">
                  <Clock className="h-3.5 w-3.5 text-rose-400" />
                  Duration: {service.duration} mins
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/s px-3.5 py-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Instant Stripe Auto-Confirm
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Treatment Overview
                </h2>
                <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                  {service.description}
                </p>
              </div>

              {/* Verified Client Reviews Section */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Verified Client Reviews ({reviews.length})
                </h3>
                {reviews.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-400">
                    No reviews yet. Book and complete this treatment to share
                    the first review!
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev._id}
                        className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {rev.userName}
                          </span>
                          <span className="text-xs font-semibold text-amber-400">
                            {"★".repeat(Math.min(5, Math.max(1, rev.rating)))}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleBookingSubmit}
              className="sticky top-24 space-y-6 rounded-3xl border border-rose-400/25 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-300">
                  <Sparkles className="h-3.5 w-3.5 text-rose-400" />
                  Reserve Appointment
                </span>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Book Your Session
                </h2>
              </div>

              <div>
                <label
                  htmlFor="booking-date"
                  className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  <Calendar className="h-3.5 w-3.5 text-rose-400" />
                  Select Date *
                </label>
                <input
                  id="booking-date"
                  type="date"
                  required
                  suppressHydrationWarning
                  min={minDate}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-white scheme-dark focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-rose-400" />
                  Select Time Slot *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                          isSelected
                            ? "border-rose-400 bg-linear-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/25"
                            : "border-white/10 bg-white/4 text-slate-300 hover:border-rose-400/40 hover:text-white"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-notes"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Stylist Notes (Optional)
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any hair/skin preferences or stylist request..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Service Fee</span>
                  <span className="font-bold text-white">${service.price}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
                  <span>Slot Confirmation</span>
                  <span className="font-semibold text-rose-300">
                    Auto-Confirmed on Stripe Pay
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:from-rose-600 hover:to-pink-700 disabled:opacity-60"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <span>
                    {user
                      ? "Reserve Slot & Go to Payment"
                      : "Sign In to Book Slot"}
                  </span>
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-rose-400" />
                Pay anytime in your dashboard or cancel before payment.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}