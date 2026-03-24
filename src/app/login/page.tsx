"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "1") setJustRegistered(true);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#111]">
            Iniciar Sesión
          </h1>
          <p className="text-sm font-sans text-[#777] mt-2">
            Accede a tu cuenta para publicar noticias
          </p>
        </div>

        {justRegistered && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm font-sans px-4 py-3 rounded mb-6">
            ✓ Cuenta creada con éxito. Ya puedes iniciar sesión.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#e5e5e5] rounded-lg p-8 shadow-sm"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-sm font-sans px-4 py-3 rounded mb-5">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#555] mb-2"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@correo.com"
              className="w-full border border-[#ddd] rounded px-4 py-3 text-sm font-sans text-[#111] placeholder-[#bbb] focus:outline-none focus:border-[#111] transition-colors"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#555] mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full border border-[#ddd] rounded px-4 py-3 text-sm font-sans text-[#111] placeholder-[#bbb] focus:outline-none focus:border-[#111] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111] text-white font-sans font-semibold py-3 rounded hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión…" : "Iniciar Sesión"}
          </button>

          <p className="text-center text-sm font-sans text-[#777] mt-6">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-[#111] font-semibold hover:opacity-60 transition-opacity"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
