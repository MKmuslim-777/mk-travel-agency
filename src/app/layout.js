import { Geist } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import ConditionalLayout from "@/components/ConditionalLayout";
import PWAInstall from "@/components/PWAInstall";
import { Toaster } from "react-hot-toast";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata = {
  title: {
    default: "MK Travel Agency | বাংলাদেশের সেরা ট্যুর অপারেটর",
    template: "%s | MK Travel Agency",
  },
  description: "বাংলাদেশের সেরা ট্যুর প্যাকেজ। কক্সবাজার, সুন্দরবন, সিলেট, বান্দরবান, সেন্ট মার্টিন ও রাঙামাটিতে ভ্রমণ করুন। সেরা দামে প্রিমিয়াম ট্যুর প্যাকেজ বুক করুন।",
  keywords: ["ট্যুর প্যাকেজ", "কক্সবাজার", "সুন্দরবন", "বাংলাদেশ ভ্রমণ", "MK Travel Agency", "tour package bangladesh", "cox's bazar tour", "sundarban tour", "sylhet tour", "bandarban tour"],
  metadataBase: new URL("https://mk-travel-agency.vercel.app"),
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "MK Travel Agency",
    url: "https://mk-travel-agency.vercel.app",
    title: "MK Travel Agency | বাংলাদেশের সেরা ট্যুর অপারেটর",
    description: "বাংলাদেশের সেরা ট্যুর প্যাকেজ। কক্সবাজার, সুন্দরবন, সিলেট সহ সারা বাংলাদেশে ভ্রমণ করুন।",
    images: [{ url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80", width: 1200, height: 630, alt: "MK Travel Agency - Bangladesh Tour Packages" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MK Travel Agency | বাংলাদেশের সেরা ট্যুর অপারেটর",
    description: "বাংলাদেশের সেরা ট্যুর প্যাকেজ। কক্সবাজার, সুন্দরবন, সিলেট সহ সারা বাংলাদেশে ভ্রমণ করুন।",
    images: ["https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "MK Travel" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn-BD" className={`${geist.variable} scroll-smooth`}>
      <body className="bg-slate-950 text-white antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        <SessionWrapper>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <PWAInstall />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e293b",
                color: "#f1f5f9",
                border: "1px solid #334155",
                borderRadius: "1rem",
                fontSize: "14px",
                fontWeight: "bold",
              },
            }}
          />
        </SessionWrapper>
      </body>
    </html>
  );
}
