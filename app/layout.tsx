import type { Metadata } from "next";
import { Providers } from './providers'
import "./globals.css";
import { CookiesProvider } from 'next-client-cookies/server';

export const metadata: Metadata = {
  title: "coDev",
  description: "Code together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <CookiesProvider>
        <Providers>
          {children}
        </Providers>
      </CookiesProvider>
      </body>
    </html>
  );
}
