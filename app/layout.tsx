import type { Metadata } from "next";
import { Providers } from './providers'
import { Session } from "./lib/types/types";
import "./globals.css";

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session | null;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}