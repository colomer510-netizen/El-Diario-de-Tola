import { prisma } from "@/lib/prisma";
import { getCategoryLabel, formatDate } from "@/lib/utils";
import Link from "next/link";
import { User, Article } from "@prisma/client";

// Tipado para articulo con autor incluido
type ArticleWithAuthor = Article & { author: Pick<User, "name"> };

export const revalidate = 60; // Regenerar portada cada 60 segundos en Vercel Cache

function CategoryPill({ category, className = "" }: { category: string; className?: string }) {
  // Colores Tola adaptados a un look más moderno (Pills suaves, texto oscuro)
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
    <span
      className={`inline-block font-sans text-[0.65rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-black/5 ${bgColor} ${textColor} ${className}`}
    >
      {getCategoryLabel(category)}
    </span>
  );
}

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 15,
  }) as ArticleWithAuthor[];

  if (articles.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in bg-gray-50/50">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center space-y-5">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path></svg>
          </div>
          <h2 className="font-sans font-bold text-2xl text-gray-900 tracking-tight">No hay contenido aún</h2>
          <p className="text-gray-500 text-sm">Sé la primera persona en publicar una noticia sobre la actualidad de nuestro municipio.</p>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 mt-4 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Publicar Ahora <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </main>
    );
  }

  const heroArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <main className="flex-1 w-full bg-[#f8fafc] pb-24">
      {/* HEADER PAGE */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-6 flex items-baseline justify-between animate-fade-in">
        <h1 className="font-sans font-black text-3xl md:text-4xl text-gray-900 tracking-tight">
          Destacado de Hoy
        </h1>
        <div className="hidden sm:flex text-sm text-gray-500 font-medium">
          Lo último en nuestra localidad
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
        
        {/* === HERO OVERLAY CARD === */}
        <Link href={`/articles/${heroArticle.id}`} className="group block relative w-full h-[55vh] min-h-[400px] max-h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10">
          {heroArticle.imageUrl ? (
            <img 
              src={heroArticle.imageUrl} 
              alt={heroArticle.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900 to-gray-800"></div>
          )}
          
          {/* Gradients to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 lg:p-12 lg:w-3/4 flex flex-col justify-end">
            <div className="mb-4">
              <CategoryPill category={heroArticle.category} />
            </div>
            <h2 className="font-sans font-black text-3xl md:text-5xl lg:text-6xl text-white tracking-tighter leading-[1.1] mb-4 group-hover:text-blue-100 transition-colors">
              {heroArticle.title}
            </h2>
            <p className="hidden md:block text-gray-200 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed mb-6 line-clamp-2">
              {heroArticle.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 text-white font-bold">
                  {heroArticle.is_anonymous ? "?" : heroArticle.author.name.charAt(0)}
                </div>
                <span>{heroArticle.is_anonymous ? "Anónimo" : heroArticle.author.name}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <time>{formatDate(heroArticle.createdAt)}</time>
            </div>
          </div>
        </Link>


        {/* === SECRECCIÓN SECUNDARIA (GRID MODERNO) === */}
        {gridArticles.length > 0 && (
          <div className="pt-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-sans font-extrabold text-2xl text-gray-900 tracking-tight">
                Últimas Noticias
              </h3>
              <div className="h-0.5 flex-1 bg-gray-200 ml-6 rounded-full hidden sm:block"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {gridArticles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`} className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  
                  {/* Imagen de la tarjeta */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                        <svg className="w-10 h-10 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm10 10H8V8h8v8z"/></svg>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <CategoryPill category={article.category} />
                    </div>
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-sans font-bold text-lg md:text-xl text-gray-900 leading-snug tracking-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
                      {article.excerpt}
                    </p>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                          {article.is_anonymous ? "?" : article.author.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-gray-700 truncate max-w-[100px]">
                          {article.is_anonymous ? "Anónimo" : article.author.name}
                        </span>
                      </div>
                      <time className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                        {formatDate(article.createdAt)}
                      </time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
