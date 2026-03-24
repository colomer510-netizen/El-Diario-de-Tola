"use client";

import { useState } from "react";
import { createArticle } from "@/lib/actions";
import { CATEGORIES } from "@/lib/utils";
import { useSession } from "next-auth/react";

const MAX_CONTENT = 2000;
const MAX_EXCERPT = 300;

export default function CreateArticlePage() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const contentLeft = MAX_CONTENT - content.length;
  const excerptLeft = MAX_EXCERPT - excerpt.length;

  function getCounterClass(left: number, max: number): string {
    const ratio = (max - left) / max;
    if (ratio < 0.8) return "counter-safe";
    if (ratio < 0.95) return "counter-warning";
    return "counter-danger";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) return;
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("is_anonymous", String(isAnonymous));

    const result = await createArticle(formData, session.user.id);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#111]">
          Publicar Noticia
        </h1>
        <p className="text-sm font-sans text-[#777] mt-1">
          Comparte lo que está pasando en tu municipio
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#e5e5e5] rounded-lg p-8 shadow-sm space-y-6"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm font-sans px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#555] mb-2"
          >
            Título de la noticia *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={200}
            placeholder="Un título claro y descriptivo"
            className="w-full border border-[#ddd] rounded px-4 py-3 text-sm font-sans text-[#111] placeholder-[#bbb] focus:outline-none focus:border-[#111] transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#555] mb-2"
          >
            Categoría *
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full border border-[#ddd] rounded px-4 py-3 text-sm font-sans text-[#111] focus:outline-none focus:border-[#111] transition-colors bg-white"
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Excerpt */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="excerpt"
              className="text-xs font-sans font-semibold uppercase tracking-wider text-[#555]"
            >
              Extracto / Resumen *
            </label>
            <span
              className={`text-xs font-sans font-mono ${getCounterClass(excerptLeft, MAX_EXCERPT)}`}
            >
              {MAX_EXCERPT - excerpt.length} / {MAX_EXCERPT}
            </span>
          </div>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            maxLength={MAX_EXCERPT}
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Breve resumen que aparecerá en la portada (máx. 300 caracteres)"
            className="w-full border border-[#ddd] rounded px-4 py-3 text-sm font-sans text-[#111] placeholder-[#bbb] focus:outline-none focus:border-[#111] transition-colors resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="content"
              className="text-xs font-sans font-semibold uppercase tracking-wider text-[#555]"
            >
              Cuerpo de la noticia *
            </label>
            <span
              className={`text-xs font-sans font-mono ${getCounterClass(contentLeft, MAX_CONTENT)}`}
            >
              {content.length} / {MAX_CONTENT} caracteres
            </span>
          </div>
          <textarea
            id="content"
            name="content"
            required
            maxLength={MAX_CONTENT}
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe tu noticia aquí. Sé objetivo, claro y preciso. Máximo 2000 caracteres."
            className={`w-full border rounded px-4 py-3 text-sm font-sans text-[#111] placeholder-[#bbb] focus:outline-none transition-colors resize-y min-h-[200px] ${
              contentLeft < 0
                ? "border-red-400 focus:border-red-500"
                : contentLeft < 100
                  ? "border-amber-400 focus:border-amber-500"
                  : "border-[#ddd] focus:border-[#111]"
            }`}
          />
          {content.length >= MAX_CONTENT && (
            <p className="text-xs font-sans text-red-600 mt-1 font-semibold">
              Has alcanzado el límite de {MAX_CONTENT} caracteres.
            </p>
          )}
        </div>

        {/* Anonymity toggle */}
        <div className="border border-[#e5e5e5] rounded-lg p-5 bg-[#fafafa]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans font-semibold text-[#333]">
                Control de privacidad del autor
              </p>
              <p className="text-xs font-sans text-[#777] mt-1">
                {isAnonymous
                  ? "Tu noticia se publicará como «Autor Anónimo»"
                  : `Tu noticia se publicará con tu nombre: ${session?.user?.name}`}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isAnonymous}
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`toggle-track ${isAnonymous ? "active" : ""} shrink-0`}
              title={isAnonymous ? "Publicar anónimamente" : "Publicar con nombre real"}
            >
              <div className="toggle-thumb" />
            </button>
          </div>
          <div className="mt-3 flex gap-4 text-xs font-sans">
            <span
              className={`flex items-center gap-1.5 ${!isAnonymous ? "text-[#111] font-semibold" : "text-[#bbb]"}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${!isAnonymous ? "bg-[#111]" : "bg-[#ddd]"}`}
              />
              Nombre real
            </span>
            <span
              className={`flex items-center gap-1.5 ${isAnonymous ? "text-[#111] font-semibold" : "text-[#bbb]"}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isAnonymous ? "bg-[#111]" : "bg-[#ddd]"}`}
              />
              Anónimo / Privado
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="imageUrl" className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#555] mb-2">
            URL de Imagen (Opcional)
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://ejemplo.com/foto.jpg"
            className="w-full border border-[#ddd] rounded px-4 py-3 text-sm font-sans text-[#111] focus:outline-none focus:border-[var(--color-tola-blue)] transition-colors"
          />
          <p className="text-xs text-[#777] mt-1 font-sans">Enlace a una fotografía representativa de la noticia.</p>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading || content.length === 0 || content.length > MAX_CONTENT}
            className="flex-1 bg-[#111] text-white font-sans font-semibold py-3 rounded hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publicando…" : "Publicar Noticia"}
          </button>
        </div>
      </form>
    </div>
  );
}
