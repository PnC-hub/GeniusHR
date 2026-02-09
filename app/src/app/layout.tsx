import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/CookieConsent";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ordinia - Gestione HR per Studi Odontoiatrici",
  description: "Il primo software HR specifico per studi dentistici. Compliance CCNL, GDPR, sicurezza D.Lgs 81/2008.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
            <DisclaimerBanner />
          </div>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
