import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banco Los Patitos",
  description: "Banca Virtual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
