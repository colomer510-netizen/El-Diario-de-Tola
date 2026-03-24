import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategoryColor, getCategoryLabel, formatDate } from "@/lib/utils";
import Link from "next/link";
import { deleteArticle } from "@/lib/actions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const articles = await prisma.article.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#111]">
            Mi Panel
          </h1>
          <p className="text-sm font-sans text-[#777] mt-1">
            Bienvenido,{" "}
            <strong className="text-[#444]">{session.user.name}</strong>
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="bg-[#111] text-white font-sans font-semibold text-sm px-5 py-2.5 rounded hover:bg-[#333] transition-colors"
        >
          + Nueva Noticia
        </Link>
      </div>

      <div className="rule-top mb-6">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#999]">
          Mis Publicaciones ({articles.length})
        </span>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#e5e5e5] rounded-lg">
          <p className="font-serif text-xl text-[#aaa]">
            Aún no has publicado ninguna noticia.
          </p>
          <Link
            href="/dashboard/create"
            className="inline-block mt-5 bg-[#111] text-white text-sm font-sans font-semibold px-6 py-3 rounded hover:bg-[#333] transition-colors"
          >
            Publicar mi primera noticia
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-[#e5e5e5] rounded-lg p-5 flex items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`category-pill ${getCategoryColor(article.category)}`}
                  >
                    {getCategoryLabel(article.category)}
                  </span>
                  <span
                    className={`text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      article.published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {article.published ? "Publicado" : "Oculto"}
                  </span>
                  {article.is_anonymous && (
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f0f0f0] text-[#777]">
                      Anónimo
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#111] truncate">
                  {article.title}
                </h3>
                <p className="text-xs font-sans text-[#999] mt-1">
                  {formatDate(article.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/articles/${article.id}`}
                  className="text-xs font-sans text-[#777] hover:text-[#111] transition-colors"
                >
                  Ver
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteArticle(article.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs font-sans text-red-600 hover:text-red-800 transition-colors"
                    onClick={(e) => {
                      if (!confirm("¿Eliminar esta noticia?"))
                        e.preventDefault();
                    }}
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
