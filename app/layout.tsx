import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Moj trudnički planer", template: "%s · Moj trudnički planer" },
  description: "Pregledaj pripreme, troškove, torbu i plan poroda na jednom mjestu.",
  applicationName: "Moj trudnički planer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4ef",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
