import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LYRA Fashion",
  description: "Minimal. Modern. Effortless.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}