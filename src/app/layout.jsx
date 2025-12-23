import "@/css/satoshi.css";
import "@/css/style.css";

import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";
import { ReduxProvider } from "@/components/ReduxProvider";

export const metadata = {
  title: {
    template: "%s | Hospital Management",
    default: "Hospital Management",
  },
  description:
    "Hospital Management System for donor care and medical administration.",
  icons: {
    icon: "/images/icon/brand.svg",
    shortcut: "/images/icon/brand.svg",
    apple: "/images/icon/brand.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ReduxProvider>
            <NextTopLoader color="#5750F1" showSpinner={false} />
            {children}
          </ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}
