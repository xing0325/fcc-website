import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import Preloader from "@/components/Preloader";
import SiteHeader from "@/components/sections/SiteHeader";
import Footer from "@/components/sections/Footer";

const ppNeue = localFont({
  src: [
    { path: "../../public/fonts/PPNeueMontreal-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/PPNeueMontreal-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-pp-neue-var",
  display: "swap",
});

const gtaMono = localFont({
  src: "../../public/fonts/GTAmericaMono-Regular.woff2",
  weight: "400",
  variable: "--font-gta-mono-var",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "FCC | Funshine Career Consulting — We Stand by the Next Generation, Own Our Career Future",
  description:
    "FCC 是一家 Boutique Career Agency，汇聚全球顶尖金融、战略咨询与科技行业的一线导师，为新世代提供私人型职业咨询与策略指导，帮助你拿到理想 Offer，规划可持续的职业成长路径。",
  icons: { icon: "/images/fcc-logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" className={`${ppNeue.variable} ${gtaMono.variable}`}>
      <body className="bg-mercury font-pp-neue antialiased">
        <Preloader />
        <LenisProvider>
          <SiteHeader />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
