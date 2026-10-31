import "./globals.css";
import { AosInitializer } from "@/components/AosInitializer";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  metadataBase: new URL("https://rokteckitsolutions.com"),
  title: {
    default: "Rokteck IT Solutions | Technology & IT Services",
    template: "%s | Rokteck IT Solutions",
  },
  description: "Rokteck IT Solutions helps businesses in Ghana work smarter with tailored IT support, technology consulting and digital solutions.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://rokteckitsolutions.com",
    siteName: "Rokteck IT Solutions",
    locale: "en_GB",
    title: "Rokteck IT Solutions | Technology & IT Services",
    description: "Tailored IT support, technology consulting and digital solutions for businesses in Ghana.",
    images: [{ url: "/assets/img/hero/hero1-image1.png", alt: "Rokteck IT Solutions team" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rokteck IT Solutions | Technology & IT Services",
    description: "Tailored IT support, technology consulting and digital solutions for businesses in Ghana.",
    images: ["/assets/img/hero/hero1-image1.png"],
  },
  robots: { index: true, follow: true },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Rokteck IT Solutions",
          url: "https://rokteckitsolutions.com",
          logo: "https://rokteckitsolutions.com/assets/img/logo/header-logo1.jpeg",
          description: "Tailored IT support, technology consulting and digital solutions for businesses in Ghana.",
          telephone: "+233556081290",
          email: "info@rokteck.com",
          address: { "@type": "PostalAddress", addressCountry: "GH" },
        }).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
