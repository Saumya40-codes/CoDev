import type { AppProps } from 'next/app';
import { Providers } from './providers'
import { Session } from "./lib/types/types";
import "./globals.css";

function RootLayout({ Component, pageProps }: AppProps) {
  const { session } = pageProps;

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <Component {...pageProps} />
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;