import type { Metadata } from "next";

export const siteOrigin = "https://rokteckitsolutions.com";

export function pageMetadata({
  title,
  description,
  path,
  image = "/assets/img/hero/hero1-image1.png",
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = new URL(path, siteOrigin).toString();
  const imageUrl = new URL(image, siteOrigin).toString();
  const fullTitle = `${title} | Rokteck IT Solutions`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: "Rokteck IT Solutions",
      locale: "en_GB",
      images: [{ url: imageUrl, alt: "Rokteck IT Solutions" }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}
