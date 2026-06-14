import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pono",
  description: "짧은 스냅과 깊이 있는 아티클을 함께 발견하는 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${plusJakartaSans.variable} ${notoSerifKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <Providers>{children}</Providers>
        </body>
    </html>
  );
}
