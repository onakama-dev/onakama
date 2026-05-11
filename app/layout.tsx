import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'
import Footer from '@/components/Footer'
import { Analytics } from "@vercel/analytics/next"


const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
});

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${notoSans.variable} ${notoSerif.variable}`}>
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              borderRadius: '16px',
              fontSize: '14px',
            }
          }}
        />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Onakama | IBS当事者同士がつながれる場所",
  description: "外出や人付き合いに不安を感じるあなたへ。無理せず、匿名でつながれる場所。",

   metadataBase: new URL("https://onakama.vercel.app/"),

  openGraph: {
    title: "Onakama | IBS当事者同士がつながれる場所",

    description:
      "外出や人付き合いに不安を感じるあなたへ。無理せず、匿名でつながれる場所。",

    url: "https://onakama.vercel.app/",

    siteName: "Onakama",

    images: [
      {
        url: "/ogp.png",
        width: 1197,
        height: 581,
        alt: "Onakama",
      },
    ],

    locale: "ja_JP",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Onakama | IBS当事者同士がつながれる場所",

    description:
      "外出や人付き合いに不安を感じるあなたへ。無理せず、匿名でつながれる場所。",

    images: ["/ogp.png"],
  },

};