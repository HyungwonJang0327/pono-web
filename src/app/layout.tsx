import { ClerkProvider } from "@clerk/nextjs";
import { koKR, enUS, jaJP } from "@clerk/localizations";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Serif_KR } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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

const clerkLocalizations = { ko: koKR, en: enUS, ja: jaJP } as const;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const clerkLocalization =
    clerkLocalizations[locale as keyof typeof clerkLocalizations] ?? koKR;

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} ${notoSerifKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: `(function(){
  var _push = history.pushState.bind(history);
  history.pushState = function(state, unused, url) {
    var from = window.location.pathname;
    var fromAuth = from.startsWith('/sign-in') || from.startsWith('/sign-up');
    if (fromAuth && url) {
      var to = url.toString();
      if (!to.startsWith('/sign-in') && !to.startsWith('/sign-up')) {
        window.location.replace(to);
        return;
      }
    }
    return _push(state, unused, url);
  };
})();` }} />
        <ClerkProvider localization={clerkLocalization}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}