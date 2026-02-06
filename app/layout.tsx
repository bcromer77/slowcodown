import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Slow County Down | Places chosen by season and sense",
  description: "County Down, Northern Ireland. No ratings. No reviews. Just places worth your time.",
  keywords: ["County Down", "Northern Ireland", "restaurants", "food", "slow travel", "Mourne Mountains", "Strangford Lough", "local food", "seasonal dining"],
  authors: [{ name: "Kevin McMahon", url: "https://slowcountydown.com" }],
  creator: "Slow County Down",
  publisher: "Slow County Down",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Slow County Down",
    description: "Places chosen by season and sense.",
    images: ["/og-image.png"],
    type: "website",
    locale: "en_GB",
    siteName: "Slow County Down",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slow County Down",
    description: "Places chosen by season and sense.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={`${inter.className} bg-warm-white text-charcoal antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
