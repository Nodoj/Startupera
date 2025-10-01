"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin') || pathname?.startsWith('/debug-auth');

  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`${isAdminPage ? 'bg-gray-50 dark:bg-gray-900' : 'bg-[#FCFCFC] dark:bg-black'} ${inter.className}`}>
        <Providers>
          {!isAdminPage && <Header />}
          {children}
          {!isAdminPage && <Footer />}
          {!isAdminPage && <ScrollToTop />}
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";

