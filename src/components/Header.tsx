"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { WeatherWidget } from "./WeatherWidget";

export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#e5e5e5] sticky top-0 z-50">
      {/* Top bar */}
      <div className="border-b border-[#e5e5e5] px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-[#777] font-sans">
          <span>
            {new Intl.DateTimeFormat("es-MX", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date())}
          </span>
          <div className="flex items-center gap-6">
            <span>Periodismo ciudadano para nuestra comunidad</span>
            <WeatherWidget />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex justify-between items-center bg-white/80 backdrop-blur-md">
        <Link href="/" className="group flex flex-col">
          <h1 className="font-sans text-2xl md:text-3xl font-black text-gray-900 tracking-tighter group-hover:text-blue-600 transition-colors">
            El Diario de Tola<span className="text-blue-500">.</span>
          </h1>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/?cat=local"
            className="text-sm font-sans font-medium text-[#333] hover:text-[#111] transition-colors"
          >
            Local
          </Link>
          <Link
            href="/?cat=politica"
            className="text-sm font-sans font-medium text-[#333] hover:text-[#111] transition-colors"
          >
            Política
          </Link>
          <Link
            href="/?cat=cultura"
            className="text-sm font-sans font-medium text-[#333] hover:text-[#111] transition-colors"
          >
            Cultura
          </Link>
          <Link
            href="/?cat=deportes"
            className="text-sm font-sans font-medium text-[#333] hover:text-[#111] transition-colors"
          >
            Deportes
          </Link>

          {session ? (
            <div className="flex items-center gap-3 ml-4 border-l border-[#e5e5e5] pl-4">
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-xs font-sans font-semibold uppercase tracking-wider bg-red-700 text-white px-3 py-1.5 rounded hover:bg-red-800 transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="text-sm font-sans font-medium text-[#333] hover:text-[#111] transition-colors"
              >
                Mi Panel
              </Link>
              <Link
                href="/dashboard/create"
                className="text-sm font-sans font-semibold bg-[#111] text-white px-4 py-2 rounded hover:bg-[#333] transition-colors"
              >
                Publicar
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs text-[#999] hover:text-[#555] transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-4 border-l border-[#e5e5e5] pl-4">
              <Link
                href="/login"
                className="text-sm font-sans font-medium text-[#333] hover:text-[#111] transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="text-sm font-sans font-semibold bg-[#111] text-white px-4 py-2 rounded hover:bg-[#333] transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded text-[#444] hover:bg-[#f0f0f0] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#e5e5e5] bg-white animate-fade-in">
          <nav className="flex flex-col p-4 gap-3">
            {["local", "politica", "cultura", "deportes"].map((cat) => (
              <Link
                key={cat}
                href={`/?cat=${cat}`}
                className="text-sm font-sans capitalize text-[#333] py-2 border-b border-[#f0f0f0]"
                onClick={() => setMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
            {session ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-sm font-semibold text-red-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Panel Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-sm text-[#333]"
                  onClick={() => setMenuOpen(false)}
                >
                  Mi Panel
                </Link>
                <Link
                  href="/dashboard/create"
                  className="text-sm font-semibold bg-[#111] text-white px-4 py-2 rounded text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Publicar Noticia
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-xs text-[#999] text-left"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-[#333]"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-[#111] text-white px-4 py-2 rounded text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
