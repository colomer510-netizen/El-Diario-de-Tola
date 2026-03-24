import { prisma } from "@/lib/prisma";
import { getCategoryColor, getCategoryLabel, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    select: { title: true, excerpt: true },
  });
  if (!article) return { title: "Noticia no encontrada" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id, published: true },
    include: { author: { select: { name: true } } },
  });

  if (!article) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-sans text-[#999] mb-8">
        <Link href="/" className="hover:text-[#555] transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-[#555] capitalize">
          {getCategoryLabel(article.category)}
        </span>
      </nav>

      {/* Category pill */}
      <span className={`category-pill ${getCategoryColor(article.category)}`}>
        {getCategoryLabel(article.category)}
      </span>

      {/* Title */}
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#111] leading-tight mt-4">
        {article.title}
      </h1>

      {/* Excerpt */}
      <p className="font-sans text-lg text-[#555] leading-relaxed border-l-4 border-[#111] pl-4 mt-6">
        {article.excerpt}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 mt-6 pb-6 border-b border-[#e5e5e5] text-sm font-sans text-[#777]">
        <div>
          <span className="text-[#999] text-xs uppercase tracking-wider">
            Autor
          </span>
          <p className="font-semibold text-[#444] mt-0.5">
            {article.is_anonymous ? "Autor Anónimo" : article.author.name}
          </p>
        </div>
        <div className="w-px h-8 bg-[#e5e5e5]" />
        <div>
          <span className="text-[#999] text-xs uppercase tracking-wider">
            Fecha
          </span>
          <p className="font-semibold text-[#444] mt-0.5">
            {formatDate(article.createdAt)}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="article-body mt-8 whitespace-pre-wrap">{article.content}</div>

      {/* Back */}
      <div className="mt-12 pt-6 border-t border-[#e5e5e5]">
        <Link
          href="/"
          className="text-sm font-sans font-semibold text-[#111] border-b-2 border-[#111] hover:opacity-60 transition-opacity"
        >
          ← Volver a las noticias
        </Link>
      </div>
    </div>
  );
}
