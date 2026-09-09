import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OCRA — Sistema operativo per agenzie creative",
  description:
    "Pipeline, clienti, verbali automatici, preventivi e contabilità in un solo posto.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
