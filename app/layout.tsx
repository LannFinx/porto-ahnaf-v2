// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SecurityShield from "@/components/SecurityShield"; // Komponen pelindung
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ─── 1. ORISINALITAS & SOCIAL MEDIA BANNER (METADATA) ───
export const metadata: Metadata = {
  // metadataBase sangat penting agar Next.js bisa memetakan gambar /assets/banner.webp menjadi URL absolut
  metadataBase: new URL("https://ahnafisaa.vercel.app/"),
  title: "Ahnaf. | Backend Developer & System Architect",
  description: "Portfolio of Muhammad Ahnaf Isa Hammam Lisualla. Interactive web experience featuring the Oracle of Khonshu.",
  authors: [{ name: "Muhammad Ahnaf" }],
  creator: "Muhammad Ahnaf",
  openGraph: {
    title: "Ahnaf. | Software Engineer",
    description: "Explore the digital archives and projects of Muhammad Ahnaf.",
    url: "https://ahnafisaa.vercel.app/",
    siteName: "Ahnaf Portfolio",
    locale: "id_ID",
    type: "website",
    // Konfigurasi Banner untuk Discord, WA, LinkedIn, dll
    images: [
      {
        url: "/assets/banner.webp",
        width: 1200,
        height: 630,
        alt: "Ahnaf Portfolio Banner",
      },
    ],
  },
  // Konfigurasi Banner khusus untuk X/Twitter & platform yang menggunakan Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Ahnaf. | Backend Developer & System Architect",
    description: "Explore the digital archives and projects of Muhammad Ahnaf.",
    images: ["/assets/banner.webp"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#020408] text-white selection:bg-[#D4AF37] selection:text-black">
        {/* ─── 2. LAPISAN ANTI-COPY ─── */}
        <SecurityShield />
        {children}
      </body>
    </html>
  );
}