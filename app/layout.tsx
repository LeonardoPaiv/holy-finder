import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AppShell } from "../components/AppShell";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Mapa da Fé",
  description: "Encontre igrejas e horários de missa próximos a você",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-slate-900 antialiased">
        <AppShell>
          <div id="root">{children}</div>
        </AppShell>
        <Toaster />
      </body>
    </html>
  );
}
