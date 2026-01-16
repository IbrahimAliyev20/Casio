import type { Metadata } from "next";
import "@/app/globals.css";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";

// Sistem fontları kullan - çok daha performanslı
// Font değişkenleri globals.css'te tanımlanmış

export const metadata: Metadata = {
  title: "Casio Azerbaijan",
  description: "Casio Azerbaijan",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const {locale} = await params;
  const messages = (await getMessages()) as Record<string, string>;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body className="antialiased">
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="min-h-screen">
              <Header />
              {children}
              <Footer />
            </div>
            <Toaster position="top-center" richColors />
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
