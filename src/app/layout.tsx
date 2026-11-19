import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import ClickBubbles from "@/components/ClickBubbles";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SalonBook",
  description: "Explore salon services and book your appointment online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={geist.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
        <ClickBubbles />
      </body>
    </html>
  );
}