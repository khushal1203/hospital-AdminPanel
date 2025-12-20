import "@/css/satoshi.css";
import "@/css/style.css";

import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";

export const metadata = {
  title: {
    template: "%s | Hospital Management",
    default: "Hospital Management",
  },
  description:
    "Hospital Management System for donor care and medical administration.",
  icons: {
    icon: '/images/icon/brand.svg',
    shortcut: '/images/icon/brand.svg',
    apple: '/images/icon/brand.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
