import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OCRA — Sistema operativo per agenzie creative",
  description: "Automazione e AI per agenzie creative",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
