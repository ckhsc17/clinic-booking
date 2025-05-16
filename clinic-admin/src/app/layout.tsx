import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clinic Admin Dashboard",
  description: "Admin panel for managing clinic bookings and patients",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: usePathname cannot be used directly in layout.tsx in App Router
  // We'll rely on children to define their own layout needs
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}