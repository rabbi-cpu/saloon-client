"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const appointmentId = searchParams.get("appointmentId");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    sessionId ? "verifying" : "error"
  );
  const [message, setMessage] = useState(
    sessionId
      ? "Verifying your Stripe payment..."
      : "Invalid payment session ID."
  );

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;

    const confirmPayment = async () => {
      try {
        const { data: sess } = await authClient.getSession();
        const token =
          sess?.session?.token || (sess?.user as { id?: string })?.id || "";
        const email = sess?.user?.email || "";

        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        if (email) headers["x-user-email"] = email;

        await axios.post(
          `${API_BASE}/api/payments/confirm`,
          { sessionId, appointmentId },
          { headers, withCredentials: true }
        );

        if (isMounted) {
          setStatus("success");
          setMessage("Payment successful! Your salon slot is now confirmed.");
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "We could not confirm the Stripe session yet. Check your dashboard to retry payment anytime.";
        setStatus("error");
        setMessage(msg);
      }
    };

    void confirmPayment();

    return () => {
      isMounted = false;
    };
  }, [sessionId, appointmentId]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
        {status === "verifying" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-rose-400" />
            <h1 className="mt-4 text-xl font-bold">Confirming Payment...</h1>
            <p className="mt-2 text-xs text-slate-400">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
            <h1 className="mt-4 text-2xl font-extrabold text-white">
              Booking Confirmed!
            </h1>
            <p className="mt-2 text-sm text-slate-300">{message}</p>
            <Link
              href="/dashboard/customer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700"
            >
              Go to My Dashboard
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-rose-400" />
            <h1 className="mt-4 text-xl font-bold text-white">
              Payment Verification Pending
            </h1>
            <p className="mt-2 text-xs text-slate-400">{message}</p>
            <Link
              href="/dashboard/customer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3 text-xs font-semibold text-white hover:bg-white/20"
            >
              Return to Dashboard
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
          Loading payment confirmation...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}