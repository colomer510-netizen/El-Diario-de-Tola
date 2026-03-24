import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: {
    template: "%s | El Diario de Tola",
    default: "El Diario de Tola | Noticias Comunitarias",
  },
  description:
    "El diario donde la comunidad de Tola informa a la comunidad. Noticias locales, turismo, deportes y actualidad municipal.",
  keywords: ["Tola", "Rivas", "Nicaragua", "noticias", "municipio", "local", "diario"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAFAFA]">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[#e5e5e5] bg-white mt-16">
            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-serif text-lg font-bold text-[#111]">
                  El Diario de Tola
                </p>
                <p className="text-xs text-[#777] mt-1">
                  Periodismo ciudadano para nuestra comunidad.
                </p>
              </div>
              <p className="text-xs text-[#999]">
                © {new Date().getFullYear()} El Diario de Tola.
                Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
