import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Ecclesia Locator",
  description: "Encontre igrejas e horários de missa próximos a você",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-slate-900 antialiased">
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
