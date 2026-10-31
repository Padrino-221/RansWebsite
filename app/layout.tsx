import "./globals.css";
import { AosInitializer } from "@/components/AosInitializer";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Rokteck IT Solutions",
  description: "Rokteck IT Solutions - Technology and IT Solutions Company",
  icons: {
    icon: "/assets/img/logo/titile.png",
    shortcut: "/assets/img/logo/titile.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.css" />
        <link rel="stylesheet" href="/assets/css/nice-select.css" />
        <link rel="stylesheet" href="/assets/css/slick-slider.css" />
        <link rel="stylesheet" href="/assets/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/assets/css/mobile-menu.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body className="bg-background text-foreground">
        <AosInitializer />
        {children}
      </body>
    </html>
  );
}
