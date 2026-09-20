import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Las María's - Sabores sin Gluten",
  description: "Menú digital de productos 100% Sin TACC para ferias y eventos.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#E35D20",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-marias-cream text-gray-800 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}