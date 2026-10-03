import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE, MEDIA } from "@/lib/content";
import { asset } from "@/lib/paths";
import "./globals.css";

const fraunces = localFont({
  src: [
    { path: "../fonts/Fraunces-Variable.woff2", style: "normal" },
    { path: "../fonts/Fraunces-Variable-Italic.woff2", style: "italic" },
  ],
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
});

const inter = localFont({
  src: "../fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const title = `${SITE.name}, an editorial Indian dining room in ${SITE.city}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url),
  title,
  description: SITE.description,
  keywords: ["Indian restaurant Bristol", "thali", "samosa", "chutney", "fine dining", "Ghughumalu"],
  openGraph: {
    title,
    description: SITE.description,
    type: "website",
    locale: "en_GB",
    images: [{ url: MEDIA.image(1), width: 1920, height: 1080, alt: `${SITE.name} royal thali` }],
  },
  twitter: { card: "summary_large_image", title, description: SITE.description, images: [MEDIA.image(1)] },
  icons: { icon: asset("icon.svg") },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fafaf8",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  description: SITE.description,
  servesCuisine: "Indian",
  priceRange: "££",
  telephone: SITE.phone,
  email: SITE.email,
  url: SITE.url,
  image: `${SITE.url}${MEDIA.image(1)}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address[0],
    addressLocality: SITE.city,
    postalCode: SITE.address[1].split(" ").slice(1).join(" "),
    addressCountry: "GB",
  },
  acceptsReservations: "True",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        {/* Only the hero assets are preloaded; everything else lazy loads near the viewport. */}
        <link rel="preload" as="image" href={asset(MEDIA.image(1))} />
        <link rel="preload" as="video" href={asset(MEDIA.video(1))} type="video/mp4" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <div className="paper" aria-hidden="true" />
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
