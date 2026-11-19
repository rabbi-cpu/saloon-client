"use client";

import Link from "next/link";
import {
  Clock,
    Mail,
  MapPin,
  Phone,
  Scissors,
  Sparkles,
} from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/services?category=Hair", label: "Hair Styling & Cuts" },
  { href: "/services?category=Skincare", label: "Facial & Skin Care" },
  { href: "/services?category=Makeup", label: "Bridal & Party Makeup" },
  { href: "/services?category=Spa", label: "Spa & Relaxation" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-rose-100/80 bg-slate-950 text-slate-300">
      {/* Subtle Top Gradient Accent */}
      <div className="h-1 w-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-400" />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/25 transition-transform duration-300 group-hover:rotate-12">
                <Scissors className="h-4 w-4" />
              </span>
              <span>
                Salon
                <span className="bg-linear-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
                  Book
                </span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400">
              Book your favorite salon and beauty treatments effortlessly.
              Verified stylists, instant slot confirmation, and seamless online
              payments.
            </p>

            {/* Social Media Icons */}
           
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-white">
              <Sparkles className="h-3.5 w-3.5 text-rose-400" />
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center text-slate-400 transition-colors duration-200 hover:translate-x-1 hover:text-rose-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Popular Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {serviceLinks.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-slate-400 transition-colors duration-200 hover:translate-x-1 hover:text-rose-400"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact & Hours
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <span>House 24, Road 11, Banani, Dhaka 1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-rose-400" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-rose-400" />
                <span>support@salonbook.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <span>Sat – Thu: 10:00 AM – 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-xs text-slate-400 sm:flex-row">
          <p>
            &copy; {currentYear}{" "}
            <span className="font-semibold text-white">SalonBook</span>. All
            rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="transition-colors hover:text-rose-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-rose-400"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}