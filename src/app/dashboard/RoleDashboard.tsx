"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  Ban,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Loader2,
  PlusCircle,
  RefreshCw,
  Scissors,
  ShieldAlert,
  Sparkles,
  Star,
  Trash2,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AppointmentItem {
  _id: string;
  serviceId: string;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  appointmentDate?: string;
  date?: string;
  timeSlot?: string;
  message?: string;
  servicePrice?: number;
  status: string;
  paymentStatus: string;
  isReviewed?: boolean;
  service?: {
    _id?: string;
    serviceName?: string;
    title?: string;
    price?: number;
    duration?: number;
    category?: string;
  };
  customer?: {
    name?: string;
    email?: string;
  };
}

interface ServiceItem {
  _id: string;
  serviceName?: string;
  title?: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  status?: string;
}

interface CustomerUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  isBlocked?: boolean;
}

interface TransactionItem {
  _id: string;
  amount: number;
  currency?: string;
  stripeSessionId?: string;
  status: string;
  createdAt?: string;
  customerEmail?: string;
  customer?: { name?: string; email?: string };
  service?: { serviceName?: string };
}

export default function RoleDashboard({
  expectedRole,
}: {
  expectedRole?: "admin" | "customer";
}) {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user as
    | {
        id?: string;
        name: string;
        email: string;
        role?: string;
      }
    | undefined;

  const userEmail = user?.email;
  const userRole = user?.role;
  const isAdmin = (expectedRole || userRole) === "admin";

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  // Action states
  const [payingId, setPayingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Review Modal state
  const [reviewBooking, setReviewBooking] = useState<AppointmentItem | null>(
    null
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Admin: New Service Form
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("Haircut & Styling");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("60");
  const [image, setImage] = useState("");
  const [creatingService, setCreatingService] = useState(false);

  const triggerReload = () => setRefreshTick((prev) => prev + 1);

  // Auth Guard
  useEffect(() => {
    if (!sessionLoading && !userEmail) {
      router.replace("/signin");
    }
  }, [sessionLoading, userEmail, router]);

  // Load Dashboard Data cleanly inside useEffect
  useEffect(() => {
    if (sessionLoading || !userEmail) return;
    let isMounted = true;

    async function loadDashboard() {
      setLoading(true);
      setFetchError(null);

      try {
        const { data: sess } = await authClient.getSession();
        const token =
          sess?.session?.token || (sess?.user as { id?: string })?.id || "";

        const headers: Record<string, string> = {
          "x-user-email": userEmail as string,
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        if (isAdmin) {
          const [apptRes, srvRes, usrRes, txRes] = await Promise.allSettled([
            axios.get(`${API_BASE}/api/admin/appointments`, {
              headers,
              withCredentials: true,
            }),
            axios.get(`${API_BASE}/api/admin/services`, {
              headers,
              withCredentials: true,
            }),
            axios.get(`${API_BASE}/api/admin/users`, {
              headers,
              withCredentials: true,
            }),
            axios.get(`${API_BASE}/api/admin/transactions`, {
              headers,
              withCredentials: true,
            }),
          ]);

          if (!isMounted) return;

          if (
            apptRes.status === "fulfilled" &&
            Array.isArray(apptRes.value.data)
          ) {
            setAppointments(apptRes.value.data);
          } else if (apptRes.status === "rejected") {
            const err = apptRes.reason;
            const msg = axios.isAxiosError(err)
              ? err.response?.data?.message || err.message
              : "Failed to load admin appointments";
            setFetchError(msg);
          }

          if (srvRes.status === "fulfilled" && Array.isArray(srvRes.value.data)) {
            setServices(srvRes.value.data);
          }
          if (usrRes.status === "fulfilled" && Array.isArray(usrRes.value.data)) {
            setCustomers(usrRes.value.data);
          }
          if (txRes.status === "fulfilled" && Array.isArray(txRes.value.data)) {
            setTransactions(txRes.value.data);
          }
        } else {
          const apptRes = await axios.get(`${API_BASE}/api/appointments/my`, {
            headers,
            withCredentials: true,
          });
          if (isMounted) {
            setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
          }
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const exactError = axios.isAxiosError(err)
          ? err.response?.data?.message ||
            `${err.message} (Check if Express server is running on ${API_BASE})`
          : "Unexpected error while loading dashboard.";
        setFetchError(exactError);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [sessionLoading, userEmail, isAdmin, refreshTick]);

  // Customer: Pay Now with Stripe
  async function handlePayNow(appointmentId: string) {
    try {
      setPayingId(appointmentId);
      const { data: sess } = await authClient.getSession();
      const token =
        sess?.session?.token || (sess?.user as { id?: string })?.id || "";

      const res = await axios.post(
        `${API_BASE}/api/payments/create-checkout-session`,
        { appointmentId },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-user-email": userEmail || "",
          },
          withCredentials: true,
        }
      );

      if (res.data?.url) {
        if (typeof window !== "undefined") {
          window.location.assign(res.data.url);
        }
      } else {
        toast.error("Stripe checkout URL not received.");
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? `${err.response.data.message}${err.response.data.error ? ` - ${err.response.data.error}` : ""}`
          : "Payment failed to start.";
      toast.error(msg);
    } finally {
      setPayingId(null);
    }
  }

  // Customer: Cancel Pending Appointment
  async function handleCancelBooking(appointmentId: string) {
    try {
      setCancellingId(appointmentId);
      await axios.patch(
        `${API_BASE}/api/appointments/${appointmentId}/cancel`,
        {},
        { withCredentials: true }
      );
      toast.success("Appointment cancelled.");
      triggerReload();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Could not cancel appointment.";
      toast.error(msg);
    } finally {
      setCancellingId(null);
    }
  }

  // Customer: Submit 5-Star Review
  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewBooking || !comment.trim()) return;

    setSubmittingReview(true);
    try {
      await axios.post(
        `${API_BASE}/api/reviews`,
        {
          serviceId:
            reviewBooking.service?._id ||
            reviewBooking.serviceId?.toString(),
          appointmentId: reviewBooking._id,
          rating,
          comment: comment.trim(),
        },
        { withCredentials: true }
      );
      toast.success("Thank you! Your verified review has been published.");
      setReviewBooking(null);
      setComment("");
      setRating(5);
      triggerReload();
    } catch {
      toast.error("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  }

  // Admin: Add New Service
  async function handleCreateService(e: React.FormEvent) {
    e.preventDefault();
    setCreatingService(true);
    try {
      await axios.post(
        `${API_BASE}/api/services`,
        {
          serviceName,
          category,
          description,
          price: Number(price),
          duration: Number(duration),
          image:
            image.trim() ||
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
          status: "active",
        },
        { withCredentials: true }
      );
      toast.success("New salon service added!");
      setServiceName("");
      setDescription("");
      setPrice("");
      setImage("");
      triggerReload();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to add service.";
      toast.error(msg);
    } finally {
      setCreatingService(false);
    }
  }

  // Admin: Delete Service
  async function handleDeleteService(id: string) {
    try {
      await axios.delete(`${API_BASE}/api/services/${id}`, {
        withCredentials: true,
      });
      toast.success("Service deleted.");
      triggerReload();
    } catch {
      toast.error("Failed to delete service.");
    }
  }

  // Admin: Confirm or Cancel Booking
  async function handleAdminBookingStatus(
    id: string,
    status: "confirmed" | "cancelled"
  ) {
    try {
      await axios.patch(
        `${API_BASE}/api/admin/appointments/${id}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Appointment marked as ${status}.`);
      triggerReload();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to update status.";
      toast.error(msg);
    }
  }

  // Admin: Block / Unblock Customer
  async function handleToggleBlock(
    customerId: string,
    currentlyBlocked?: boolean
  ) {
    try {
      await axios.patch(
        `${API_BASE}/api/admin/users/${customerId}/block`,
        { isBlocked: !currentlyBlocked },
        { withCredentials: true }
      );
      toast.success(
        !currentlyBlocked ? "Customer blocked." : "Customer unblocked."
      );
      triggerReload();
    } catch {
      toast.error("Failed to update customer status.");
    }
  }

  if (sessionLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-rose-400" />
        Loading dashboard...
      </div>
    );
  }

  const totalCount = appointments.length;
  const pendingCount = appointments.filter(
    (a) => a.status?.toLowerCase() === "pending"
  ).length;
  const confirmedCount = appointments.filter(
    (a) => a.status?.toLowerCase() === "confirmed"
  ).length;
  const paidCount = appointments.filter(
    (a) => a.paymentStatus?.toLowerCase() === "paid"
  ).length;

  return (
    <section className="relative isolate min-h-screen bg-slate-950 py-12 text-white sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(244,63,94,0.22),rgba(15,23,42,0))]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top Welcome Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose-200">
              <Sparkles className="h-3 w-3 text-rose-400" />
              {isAdmin ? "Admin Control Center" : "Client Dashboard"}
            </span>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>

          {!isAdmin && (
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700"
            >
              <Scissors className="h-3.5 w-3.5" />
              Book New Treatment
            </Link>
          )}
        </div>

        {/* Exact Error Diagnostic Banner (if API fails) */}
        {fetchError && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-400/35 bg-red-500/15 px-5 py-4 text-xs text-red-200">
            <div>
              <p className="font-bold text-red-100">
                Dashboard Sync Notice: {fetchError}
              </p>
              <p className="mt-0.5 text-red-200/80">
                Make sure your Express server is running on {API_BASE} and you
                have restarted it after updating authMiddleware.js.
              </p>
            </div>
            <button
              type="button"
              onClick={triggerReload}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-500/30 px-4 py-1.5 font-semibold text-white hover:bg-red-500/40"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Live Stats Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-xs text-slate-400">Total Bookings</p>
            <p className="mt-1 text-2xl font-extrabold text-white">
              {totalCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-xs text-slate-400">Pending Approval</p>
            <p className="mt-1 text-2xl font-extrabold text-amber-400">
              {pendingCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-xs text-slate-400">Confirmed Slots</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-400">
              {confirmedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <p className="text-xs text-slate-400">
              {isAdmin ? "Active Customers" : "Paid Treatments"}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-rose-400">
              {isAdmin ? customers.length : paidCount}
            </p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              {isAdmin ? "All Salon Appointments" : "My Booked Appointments"}
            </h2>
            <button
              type="button"
              onClick={triggerReload}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-rose-400/40 hover:text-white"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-slate-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-rose-400" />
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-12 text-center">
              <Scissors className="mx-auto h-9 w-9 text-rose-400/80" />
              <p className="mt-3 text-sm font-semibold text-white">
                No appointments found yet
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Explore our luxury salon catalog and reserve your first session.
              </p>
              {!isAdmin && (
                <Link
                  href="/services"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2.5 text-xs font-semibold text-white"
                >
                  Browse Services
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {appointments.map((item) => {
                const title =
                  item.service?.serviceName ||
                  item.service?.title ||
                  "Salon Treatment";
                const apptDate = item.appointmentDate || item.date || "N/A";
                const priceVal = item.servicePrice ?? item.service?.price ?? 0;
                const statusLower = (item.status || "pending").toLowerCase();
                const isPaid =
                  (item.paymentStatus || "unpaid").toLowerCase() === "paid";

                return (
                  <div
                    key={item._id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/75 p-5 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {title}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                            statusLower === "confirmed"
                              ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
                              : statusLower === "cancelled"
                              ? "border border-red-400/30 bg-red-500/15 text-red-300"
                              : "border border-amber-400/30 bg-amber-500/15 text-amber-300"
                          }`}
                        >
                          {statusLower}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                            isPaid
                              ? "border border-sky-400/30 bg-sky-500/15 text-sky-300"
                              : "border border-rose-400/30 bg-rose-500/15 text-rose-300"
                          }`}
                        >
                          {isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-rose-400" />
                          {apptDate}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-rose-400" />
                          {item.timeSlot}
                        </span>
                        <span className="inline-flex items-center gap-0.5 font-bold text-rose-300">
                          <DollarSign className="h-3.5 w-3.5" />
                          {priceVal}
                        </span>
                      </div>

                      {isAdmin && (
                        <p className="text-xs text-slate-400">
                          Client:{" "}
                          <span className="text-slate-200">
                            {item.customer?.name ||
                              item.customerName ||
                              item.customerEmail}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {!isAdmin &&
                        !isPaid &&
                        statusLower !== "cancelled" && (
                          <button
                            type="button"
                            disabled={payingId === item._id}
                            onClick={() => handlePayNow(item._id)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700 disabled:opacity-60"
                          >
                            {payingId === item._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CreditCard className="h-3.5 w-3.5" />
                            )}
                            Pay Now (${priceVal})
                          </button>
                        )}

                      {!isAdmin && statusLower === "pending" && !isPaid && (
                        <button
                          type="button"
                          disabled={cancellingId === item._id}
                          onClick={() => handleCancelBooking(item._id)}
                          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-red-400/40 hover:text-red-300"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      )}

                      {!isAdmin && isPaid && !item.isReviewed && (
                        <button
                          type="button"
                          onClick={() => setReviewBooking(item)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/35 bg-amber-500/15 px-4 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/25"
                        >
                          <Star className="h-3.5 w-3.5 text-amber-400" />
                          Leave Review
                        </button>
                      )}

                      {isAdmin && statusLower === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleAdminBookingStatus(item._id, "confirmed")
                            }
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAdminBookingStatus(item._id, "cancelled")
                            }
                            className="inline-flex items-center gap-1 rounded-full bg-red-600/80 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Admin Only Sections */}
        {isAdmin && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Add New Service */}
            <form
              onSubmit={handleCreateService}
              className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 lg:col-span-5"
            >
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <PlusCircle className="h-5 w-5 text-rose-400" />
                Add New Salon Service
              </h2>
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Service Name"
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-2.5 text-sm text-white"
              />
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category (e.g. Haircut & Styling)"
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-2.5 text-sm text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  required
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price ($)"
                  className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-2.5 text-sm text-white"
                />
                <input
                  type="number"
                  required
                  min={10}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Duration (mins)"
                  className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-2.5 text-sm text-white"
                />
              </div>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Image URL (optional)"
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-2.5 text-sm text-white"
              />
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Service description..."
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-2.5 text-sm text-white"
              />
              <button
                type="submit"
                disabled={creatingService}
                className="w-full rounded-full bg-linear-to-r from-rose-500 to-pink-600 py-3 text-xs font-semibold text-white"
              >
                {creatingService ? "Adding..." : "Create Service"}
              </button>
            </form>

            {/* Manage Services, Customers & Payment Ledger */}
            <div className="space-y-6 lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <h2 className="text-lg font-bold text-white">
                  Active Services ({services.length})
                </h2>
                <div className="mt-4 max-h-60 space-y-2.5 overflow-y-auto pr-1">
                  {services.map((srv) => (
                    <div
                      key={srv._id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {srv.serviceName || srv.title}
                        </p>
                        <p className="text-slate-400">
                          {srv.category} • ${srv.price} • {srv.duration} mins
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(srv._id)}
                        className="rounded-lg p-2 text-red-400 hover:bg-red-500/15"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                  <Users className="h-5 w-5 text-rose-400" />
                  Registered Customers ({customers.length})
                </h2>
                <div className="mt-4 max-h-60 space-y-2.5 overflow-y-auto pr-1">
                  {customers.map((cust) => (
                    <div
                      key={cust._id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{cust.name}</p>
                        <p className="text-slate-400">{cust.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleBlock(cust._id, cust.isBlocked)
                        }
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${
                          cust.isBlocked
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {cust.isBlocked ? (
                          <>
                            <UserCheck className="h-3.5 w-3.5" /> Unblock
                          </>
                        ) : (
                          <>
                            <Ban className="h-3.5 w-3.5" /> Block
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

             {/* Payment Ledger */}
<div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
  <h2 className="flex items-center gap-2 text-lg font-bold text-white">
    <ShieldAlert className="h-5 w-5 text-emerald-400" />
    Stripe Payment Ledger ({transactions.length})
  </h2>
  <div className="mt-4 max-h-64 space-y-2.5 overflow-y-auto pr-1 text-xs">
    {transactions.length === 0 ? (
      <p className="text-slate-400">No Stripe transactions yet.</p>
    ) : (
      transactions.map((tx) => {
        const txId = tx.stripeSessionId || tx._id;
        return (
          <div
            key={tx._id}
            className="flex flex-col justify-between gap-2 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 sm:flex-row sm:items-center"
          >
            <div className="min-w-0 space-y-1">
              <p className="font-bold text-white">
                {tx.service?.serviceName || "Salon Payment"}
              </p>
              <p className="text-slate-400">
                {tx.customer?.email || tx.customerEmail}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-sky-300">
                  TX ID: {txId}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(txId);
                    toast.success("Transaction ID copied!");
                  }}
                  className="text-[10px] font-semibold text-rose-400 hover:text-rose-300"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="block font-extrabold text-emerald-400">
                +${tx.amount} {tx.currency || "USD"}
              </span>
              {tx.createdAt && (
                <span className="text-[10px] text-slate-400">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        );
      })
    )}
  </div>
</div>
            </div>
          </div>
        )}
      </div>

      {/* 5-Star Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleReviewSubmit}
            className="w-full max-w-md space-y-4 rounded-3xl border border-white/15 bg-slate-900 p-6 text-white shadow-2xl"
          >
            <h3 className="text-lg font-bold">
              Rate {reviewBooking.service?.serviceName || "Your Experience"}
            </h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
                    rating >= star
                      ? "bg-amber-500 text-slate-950"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {star} ★
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with our stylists..."
              className="w-full rounded-xl border border-white/15 bg-slate-950 p-3 text-sm text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewBooking(null)}
                className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2 text-xs font-semibold text-white"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}