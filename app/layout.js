"use client";

import { geistSans, geistMono } from "@/app/fonts";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }) {
  const pathname = usePathname();

  // 🚫 Cacher Navbar + Footer sur certaines pages :
  const hideNavbar =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          {!hideNavbar && <Navbar />}
          <main className="min-h-screen relative">{children}</main>
          {!hideNavbar && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
