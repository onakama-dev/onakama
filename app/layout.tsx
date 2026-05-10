import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'
import Footer from '@/components/Footer'


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
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Onakama",
  description: "Onakama IBSの同じ悩みを抱える方々の出会いの場",
};