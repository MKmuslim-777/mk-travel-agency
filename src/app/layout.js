import { Geist } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PWAInstall from "@/components/PWAInstall";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata = {
  title: {
    default: "MK Travel Agency | বাংলাদেশের সেরা ট্যুর অপারেটর",
    template: "%s | MK Travel Agency",
  },
  description: "বাংলাদেশের সেরা ট্যুর প্যাকেজ। কক্সবাজার, সুন্দরবন, সিলেট সহ সারা বাংলাদেশে ভ্রমণ করুন।",
  keywords: ["ট্যুর প্যাকেজ", "কক্সবাজার", "সুন্দরবন", "বাংলাদেশ ভ্রমণ", "MK Travel Agency"],
  metadataBase: new URL("https://mk-travel-agency.vercel.app"),
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "MK Travel Agency",
  },
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
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <PWAInstall />
        </SessionWrapper>
      </body>
    </html>
  );
}
