"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/actions";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);
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
            Crear Cuenta
          </h1>
          <p className="text-sm font-sans text-[#777] mt-2">
            Únete a la comunidad y publica tus noticias
          </p>
        </div>

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
              htmlFor="name"
              className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#555] mb-2"
            >
              Nombre completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Juan Pérez"
              className="w-full border border-[#ddd] rounded px-4 py-3 text-sm font-sans text-[#111] placeholder-[#bbb] focus:outline-none focus:border-[#111] transition-colors"
            />
          </div>

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
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-[#ddd] rounded px-4 py-3 text-sm font-sans text-[#111] placeholder-[#bbb] focus:outline-none focus:border-[#111] transition-colors"
            />
            <p className="text-[11px] text-[#aaa] font-sans mt-1.5">
              Mínimo 6 caracteres
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111] text-white font-sans font-semibold py-3 rounded hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando cuenta…" : "Crear Cuenta"}
          </button>

          <p className="text-center text-sm font-sans text-[#777] mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-[#111] font-semibold hover:opacity-60 transition-opacity"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
