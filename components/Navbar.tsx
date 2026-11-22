"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  CalendarCheck,
  Camera,
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Scissors,
  UserCheck,
  UserCog,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as
    | {
        name: string;
        email: string;
        image?: string;
        role?: string;
        phone?: string;
      }
    | undefined;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Profile Settings Modal States (Name & Profile Picture)
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Instant UI overrides after saving
  const [customName, setCustomName] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const displayName = customName || user?.name || "Member";
  const displayImage = customImage !== null ? customImage : user?.image || "";

  // Global Axios Interceptor (Safely registered inside useEffect)
  useEffect(() => {
    const interceptorId = axios.interceptors.request.use(async (config) => {
      try {
        const { data } = await authClient.getSession();
        const token =
          data?.session?.token || (data?.user as { id?: string })?.id;
        if (token) config.headers.Authorization = `Bearer ${token}`;
        if (data?.user?.email) config.headers["x-user-email"] = data.user.email;
      } catch {
        // Ignore session errors
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, []);

  // Open Profile Settings modal with current values
  function openProfileSettings() {
    setProfileName(displayName);
    setProfileImage(displayImage);
    setProfilePhone(user?.phone || "");
    setDropdownOpen(false);
    setMobileOpen(false);
    setProfileModalOpen(true);
  }

  // Handle local image file selection -> Base64 preview
  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Please select an image smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  // Save updated Name & Profile Picture to Better Auth + Express Backend
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setSavingProfile(true);
    try {
      const { data: sess } = await authClient.getSession();
      const token =
        sess?.session?.token || (sess?.user as { id?: string })?.id || "";

      // 1. Update in Express MongoDB backend
      await axios.patch(
        `${API_BASE}/api/users/profile`,
        {
          name: profileName.trim(),
          image: profileImage.trim(),
          phone: profilePhone.trim(),
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-user-email": user?.email || "",
          },
          withCredentials: true,
        }
      );

      // 2. Sync with Better Auth session if supported
      try {
        await authClient.updateUser({
          name: profileName.trim(),
          image: profileImage.trim() || undefined,
        });
      } catch {
        // Backend already updated
      }

      setCustomName(profileName.trim());
      setCustomImage(profileImage.trim());
      toast.success("Profile name & photo updated!");
      setProfileModalOpen(false);
    } catch {
      toast.error("Failed to update profile settings.");
    } finally {
      setSavingProfile(false);
    }
  }

  const dashboardHref =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer";

  async function handleSignOut() {
    await authClient.signOut();
    setDropdownOpen(false);
    toast.success("Signed out successfully.");
    router.push("/signin");
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-lg font-extrabold tracking-tight text-white">
                SalonBook
              </span>
              <span className="block text-[9px] font-semibold tracking-[0.22em] text-rose-300 uppercase">
                Luxury Studio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition ${
                    active
                      ? "font-bold text-rose-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {user && (
              <Link
                href={dashboardHref}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold transition ${
                  pathname?.startsWith("/dashboard")
                    ? "text-amber-300"
                    : "text-amber-400 hover:text-amber-300"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right User Profile Pill & Dropdown */}
          <div className="hidden items-center gap-3 md:flex">
            {isPending ? (
              <div className="h-10 w-36 animate-pulse rounded-full bg-white/10" />
            ) : !user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/signin"
                  className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:border-rose-400/50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/4 py-1.5 pr-3.5 pl-2 text-left transition hover:border-rose-400/40"
                >
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt={displayName}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-rose-400/50"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r from-rose-500 to-pink-600 text-xs font-bold text-white uppercase">
                      {displayName.charAt(0)}
                    </span>
                  )}
                  <div>
                    <p className="max-w-36 truncate text-xs font-bold text-white uppercase">
                      {displayName}
                    </p>
                    <p className="text-[10px] font-semibold tracking-wider text-rose-400 uppercase">
                      {user.role === "admin" ? "ADMIN" : "MEMBER"}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 rounded-2xl border border-white/15 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="px-2 pb-3">
                      <p className="truncate text-xs font-extrabold text-white uppercase">
                        {displayName}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {user.email}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-rose-300 uppercase">
                        <UserCheck className="h-3 w-3 text-rose-400" />
                        {user.role === "admin"
                          ? "SYSTEM ADMIN"
                          : "VERIFIED CLIENT"}
                      </span>
                    </div>

                    <div className="my-1 border-t border-white/10" />

                    <Link
                      href={dashboardHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                    >
                      <LayoutDashboard className="h-4 w-4 text-rose-400" />
                      My Dashboard
                    </Link>

                    <Link
                      href="/services"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                    >
                      <CalendarCheck className="h-4 w-4 text-amber-400" />
                      Book a Treatment
                    </Link>

                    <button
                      type="button"
                      onClick={openProfileSettings}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                    >
                      <UserCog className="h-4 w-4 text-sky-400" />
                      Profile Settings
                    </button>

                    <div className="my-1 border-t border-white/10" />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-xs font-semibold text-rose-400 transition hover:bg-rose-500/15"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-xl border border-white/15 p-2 text-slate-200 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="space-y-2 border-t border-white/10 bg-slate-950 px-4 py-4 md:hidden">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm font-semibold text-amber-400"
                >
                  My Dashboard
                </Link>
                <button
                  type="button"
                  onClick={openProfileSettings}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-sky-300"
                >
                  Profile Settings
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                onClick={() => setMobileOpen(false)}
                className="block rounded-full bg-linear-to-r from-rose-500 to-pink-600 py-2.5 text-center text-xs font-semibold text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Profile Settings Modal (Change Profile Photo & Display Name) */}
      {profileModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSaveProfile}
            className="w-full max-w-md space-y-4 rounded-3xl border border-white/15 bg-slate-900 p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <UserCog className="h-5 w-5 text-rose-400" />
                Profile Settings
              </h3>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Avatar Live Preview + Upload Button */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <div className="relative">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile Preview"
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-rose-500"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-r from-rose-500 to-pink-600 text-2xl font-extrabold text-white uppercase">
                    {(profileName || user.name).charAt(0)}
                  </div>
                )}
                <label
                  htmlFor="pp-file-upload"
                  className="absolute right-0 bottom-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600"
                  title="Upload Photo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </label>
                <input
                  id="pp-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Click the camera icon to upload a photo or paste an image URL
                below
              </p>
            </div>

            {/* Profile Picture URL */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Profile Picture URL
              </label>
              <input
                type="text"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://example.com/my-photo.jpg"
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
              />
            </div>

            {/* Display Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Display Name
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-rose-400 focus:outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="+880 1XXX-XXXXXX"
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-rose-400 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700 disabled:opacity-60"
              >
                {savingProfile && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}