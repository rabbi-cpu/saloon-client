"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";

const studioInfo = [
  {
    icon: MapPin,
    title: "Flagship Studio",
    detail: "House 24, Road 11, Banani, Dhaka 1213, Bangladesh",
  },
  {
    icon: Phone,
    title: "Direct Concierge",
    detail: "+880 1307960895",
  },
  {
    icon: Mail,
    title: "Support Email",
    detail: "support@salonbook.com",
  },
  {
    icon: Clock,
    title: "Studio Hours",
    detail: "Saturday – Thursday: 10:00 AM – 9:00 PM",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Message sent! Our salon concierge will get back to you shortly.");

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "General Inquiry",
      message: "",
    });
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-slate-950 py-16 text-white sm:py-24">
      {/* Ambient Radial Mesh & Dot-Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(244,63,94,0.28),rgba(15,23,42,0))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px 24px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 -left-24 -z-10 h-96 w-96 rounded-full bg-rose-600/20 blur-[130px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            Concierge & Support
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Get in{" "}
            <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Have questions about bridal packages, appointment slots, or custom
            treatments? Reach out and we&apos;ll respond promptly.
          </p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Studio Contact Cards */}
          <div className="space-y-4 lg:col-span-5">
            {studioInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl transition-all duration-300 hover:border-rose-400/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-400/25 bg-rose-500/15 text-rose-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Interactive Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-3xl border border-white/15 bg-slate-900/75 p-7 shadow-2xl backdrop-blur-2xl sm:p-9"
            >
              {submitted && (
                <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    Your inquiry has been logged. Our team will reach out via
                    email shortly.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Phone (Optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXX-XXXXXX"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Inquiry Topic
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-white focus:border-rose-400 focus:outline-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Bridal & Event Package">
                      Bridal & Event Package
                    </option>
                    <option value="Appointment Rescheduling">
                      Appointment Rescheduling
                    </option>
                    <option value="Payment & Billing">Payment & Billing</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can assist you..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:from-rose-600 hover:to-pink-700 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? "Sending Message..." : "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}