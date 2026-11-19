"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Scissors,
  Settings,
  Sparkles,
  User,
  UserCheck,
} from "lucide-react";

import { authClient, dashboardPath } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as
    | { name: string; email?: string; image?: string | null; role?: string }
    | undefined;

  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    ...publicLinks,
    ...(user
      ? user.role === "admin"
        ? [{ href: "/admin/services", label: "Manage Services" }]
        : [{ href: "/dashboard/appointments", label: "My Appointments" }]
      : []),
  ];

  async function handleLogout() {
    await authClient.signOut();
    toast.success("You have been logged out");
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-out ${
        scrolled
          ? "border-b border-rose-500/20 bg-slate-950/90 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          : "border-b border-white/10 bg-slate-950/95 backdrop-blur-md"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-500 ease-out sm:px-6 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105">
            <Scissors className="h-4 w-4" />
          </span>
          <span>
            Salon
            <span className="bg-linear-to-r from-rose-300 via-pink-400 to-amber-200 bg-clip-text text-transparent">
              Book
            </span>
          </span>
        </Link>

        {/* Desktop Nav Items with Glowing Bottom Light */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isHashLink = link.href.startsWith("/#");
            const active = isHashLink
              ? false
              : link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${
                  active ? "text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                <span className="relative z-10">{link.label}</span>

                {/* Glowing Light Bar Under Item */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 bottom-0.5 h-[2px rounded-full bg-linear-to-r from-rose-400 via-pink-500 to-amber-300 transition-all duration-300 ${
                    active
                      ? "scale-x-100 opacity-100 shadow-[0_0_12px_#f43f5e,0_0_20px_#ec4899]"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-hover:shadow-[0_0_12px_#f43f5e]"
                  }`}
                />
                {/* Soft Ambient Bottom Glow */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-4 -bottom-0.5 h-2 rounded-full bg-rose-500/40 blur-sm transition-opacity duration-300 ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-80"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth / Profile */}
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center gap-2.5 rounded-full border border-white/15 bg-white/6 p-1 pr-3.5 shadow-sm outline-none transition-all duration-300 hover:border-rose-400/40 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rose-500">
                <Avatar className="h-8 w-8 ring-2 ring-rose-400/30 transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="bg-linear-to-br from-rose-500 to-pink-600 text-xs font-semibold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="max-w-110px truncate text-xs font-semibold text-white">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-medium capitalize text-rose-300">
                    {user.role || "Customer"}
                  </span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="mt-2 w-60 rounded-2xl border-white/15 bg-slate-900/95 p-2 text-slate-200 shadow-2xl backdrop-blur-xl"
              >
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  {user.email && (
                    <p className="truncate text-xs text-slate-400">
                      {user.email}
                    </p>
                  )}
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={() => router.push(dashboardPath(user.role))}
                  className="cursor-pointer rounded-xl py-2.5 text-sm font-medium text-slate-200 focus:bg-white/10 focus:text-rose-300"
                >
                  <LayoutDashboard className="mr-2.5 h-4 w-4 text-rose-400" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      user.role === "admin"
                        ? "/admin/services"
                        : "/dashboard/appointments"
                    )
                  }
                  className="cursor-pointer rounded-xl py-2.5 text-sm font-medium text-slate-200 focus:bg-white/10 focus:text-rose-300"
                >
                  {user.role === "admin" ? (
                    <>
                      <Settings className="mr-2.5 h-4 w-4 text-rose-400" />
                      Manage Services
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="mr-2.5 h-4 w-4 text-rose-400" />
                      My Appointments
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer rounded-xl py-2.5 text-sm font-medium text-slate-200 focus:bg-white/10 focus:text-rose-300"
                >
                  <User className="mr-2.5 h-4 w-4 text-rose-400" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-xl py-2.5 text-sm font-medium text-rose-400 focus:bg-rose-500/15 focus:text-rose-300"
                >
                  <LogOut className="mr-2.5 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/signin"
                className={`${buttonVariants({ variant: "ghost" })} rounded-full px-5 font-medium text-slate-200 hover:bg-white/10 hover:text-white`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={`${buttonVariants()} group rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-6 font-semibold text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-[1.02] hover:from-rose-600 hover:to-pink-700`}
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Drawer */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className={`${buttonVariants({ variant: "ghost", size: "icon" })} rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/15 hover:text-rose-300 lg:hidden`}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-80 flex-col justify-between border-l border-white/10 bg-slate-950/95 text-white backdrop-blur-2xl"
          >
            <div>
              <SheetHeader className="border-b border-white/10 pb-4 text-left">
                <SheetTitle className="flex items-center gap-2.5 text-xl font-bold text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-rose-500 to-pink-600 text-white">
                    <Scissors className="h-4 w-4" />
                  </span>
                  <span>
                    Salon<span className="text-rose-400">Book</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`relative flex items-center justify-between overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        active
                          ? "bg-rose-500/15 font-semibold text-rose-300 ring-1 ring-rose-400/30"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{link.label}</span>
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_10px_#f43f5e]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              {user ? (
                <div className="flex flex-col gap-1.5">
                  <div className="mb-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <Avatar className="h-10 w-10 ring-2 ring-rose-400/30">
                      <AvatarImage src={user.image ?? undefined} alt={user.name} />
                      <AvatarFallback className="bg-rose-500 text-sm font-semibold text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="flex items-center gap-1 text-xs capitalize text-rose-300">
                        <UserCheck className="h-3 w-3" />
                        {user.role || "Customer"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={dashboardPath(user.role)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-rose-300"
                  >
                    <LayoutDashboard className="h-4 w-4 text-rose-400" />
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-rose-300"
                  >
                    <User className="h-4 w-4 text-rose-400" />
                    My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/15"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/signin"
                    onClick={() => setOpen(false)}
                    className={`${buttonVariants({ variant: "outline" })} w-full rounded-xl border-white/15 bg-white/5 font-medium text-white hover:bg-white/10`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className={`${buttonVariants()} w-full rounded-xl bg-linear-to-r from-rose-500 to-pink-600 font-semibold text-white shadow-lg shadow-rose-500/25`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}