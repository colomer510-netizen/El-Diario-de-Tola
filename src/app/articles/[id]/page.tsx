import { prisma } from "@/lib/prisma";
import { getCategoryLabel, formatDate } from "@/lib/utils";
import { ShareButtons } from "@/components/ShareButtons";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

// Next.js 15+ espera que params sea una Promesa
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await prisma.article.findUnique({
    where: { id: resolvedParams.id },
    select: { title: true, excerpt: true },
  });
  if (!article) return { title: "Noticia no encontrada" };
  return { title: article.title, description: article.excerpt };
}

function CategoryPill({ category }: { category: string }) {
  let bgColor = "bg-blue-100/80";
  let textColor = "text-blue-800";
  
  if (["MEDIO AMBIENTE", "COMUNIDAD", "SALUD"].includes(category)) {
    bgColor = "bg-green-100/80";
    textColor = "text-green-800";
  } else if (["ECONOMÍA", "DEPORTES"].includes(category)) {
    bgColor = "bg-yellow-100/80";
    textColor = "text-yellow-800";
  }

  return (
    <span className={`inline-block font-sans text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm border border-black/5 ${bgColor} ${textColor}`}>
      {getCategoryLabel(category)}
    </span>
  );
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const article = await prisma.article.findUnique({
    where: { id: resolvedParams.id, published: true },
    include: { author: { select: { name: true } } },
  });

  if (!article) notFound();

  return (
    <main className="flex-1 w-full bg-[#f8fafc] pb-24">
      {/* Hero Header para la noticia */}
      <div className="w-full relative bg-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {article.imageUrl ? (
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover opacity-40 blur-sm scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-gray-900 opacity-80"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors mb-8 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <span>&larr;</span> Volver al inicio
          </Link>
          
          <div className="mb-6">
            <CategoryPill category={article.category} />
          </div>
          
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-6">
            {article.title}
          </h1>
          
          <p className="font-sans text-xl md:text-2xl text-gray-300 font-medium leading-relaxed max-w-3xl mb-8">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                {article.is_anonymous ? "?" : article.author.name.charAt(0)}
              </div>
              <span className="text-white">{article.is_anonymous ? "Autor Anónimo" : article.author.name}</span>
            </div>
            <div className="bg-white/5 px-4 py-2 rounded-full backdrop-blur-md">
              <time>{formatDate(article.createdAt)}</time>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {article.imageUrl && (
          <div className="w-full mb-12 rounded-2xl overflow-hidden shadow-xl -mt-24 relative z-10 border-4 border-white bg-white">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        <article className="prose prose-lg prose-blue max-w-none text-gray-700 font-sans leading-loose whitespace-pre-wrap">
          {article.content}
        </article>

        {/* Share Buttons */}
        <ShareButtons title={article.title} />

        {/* Footer del artículo */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
          >
            Leer más noticias
          </Link>
        </div>
      </div>
    </main>
  );
}
