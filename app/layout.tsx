import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Testimonial Engine | Customer Social Proof & Feedback Platform",
  description:
    "Capture high-converting video and text testimonials, measure NPS, and embed high-speed Wall of Love widgets on any website without code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0B0F19] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
