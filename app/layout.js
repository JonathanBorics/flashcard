import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../components/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

// Az alap metaadatok itt maradnak
export const metadata = {
  title: "Angol Tanuló Flashcard",
  description: "Tanulj angolul flashcard játékkal",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AngolTanuló",
  },
};

// A viewportra és témára vonatkozó beállításokat ide helyezzük át
// a Next.js új konvenciói szerint.
export const viewport = {
  themeColor: "#1976d2",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
