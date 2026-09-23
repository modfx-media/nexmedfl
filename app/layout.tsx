import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BookNowBanner } from "@/components/BookNowBanner";
import { ChatWidget } from "@/components/ChatWidget";
import { JsonLd } from "@/components/JsonLd";
import { getDisplayedGoogleReviews } from "@/lib/google-reviews";
import { buildGoogleReviewsSchema } from "@/lib/schema";
import { SITE_NAME, SITE_URL, SITE_DEFAULT_DESCRIPTION } from "@/lib/site-config";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-EK21FME40L";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Serif display face used for the homepage hero headline only, to give
// it a more editorial/premium feel against the full-bleed photo.
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { reviews, meta } = await getDisplayedGoogleReviews();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={buildGoogleReviewsSchema(reviews, meta)} />
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "yj6mgwtmq6");
          `}
        </Script>
        <SiteHeader />
        {children}
        <SiteFooter />
        <BookNowBanner />
        <ChatWidget />
      </body>
    </html>
  );
}
