import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategoryColor, getCategoryLabel, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  adminDeleteArticle,
  togglePublished,
  promoteUser,
  demoteUser,
} from "@/lib/actions";

export default async function AdminPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const [articles, users] = await Promise.all([
    prisma.article.findMany({
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-2 h-10 bg-red-700 rounded" />
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#111]">
            Panel de Administración
          </h1>
          <p className="text-sm font-sans text-[#777] mt-0.5">
            Gestión de contenido y usuarios del portal
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Noticias", value: articles.length },
          {
            label: "Publicadas",
            value: articles.filter((a) => a.published).length,
          },
          {
            label: "Ocultas",
            value: articles.filter((a) => !a.published).length,
          },
          { label: "Usuarios", value: users.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-[#e5e5e5] rounded-lg p-5 text-center"
          >
            <p className="font-serif text-3xl font-bold text-[#111]">
              {stat.value}
            </p>
            <p className="text-xs font-sans text-[#999] uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Articles table */}
      <section className="mb-12">
        <div className="rule-top mb-4">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#999]">
            Todas las Noticias
          </span>
        </div>
        <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                  {["Título", "Categoría", "Autor", "Fecha", "Estado", "Acciones"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#999]"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="px-4 py-3 max-w-[240px]">
                      <Link
                        href={`/articles/${article.id}`}
                        className="font-semibold text-[#111] hover:opacity-60 transition-opacity line-clamp-2"
                      >
                        {article.title}
                      </Link>
                      {article.is_anonymous && (
                        <span className="text-[10px] text-[#aaa] font-medium">
                          [Anónimo]
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`category-pill ${getCategoryColor(article.category)}`}
                      >
                        {getCategoryLabel(article.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#666] whitespace-nowrap">
                      {article.author.name}
                      <br />
                      <span className="text-[10px] text-[#aaa]">
                        {article.author.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#999] text-xs whitespace-nowrap">
                      {formatDate(article.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                          article.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {article.published ? "Visible" : "Oculta"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Toggle published */}
                        <form
                          action={async () => {
                            "use server";
                            await togglePublished(article.id, article.published);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-[#555] hover:text-[#111] transition-colors underline"
                          >
                            {article.published ? "Ocultar" : "Publicar"}
                          </button>
                        </form>
                        {/* Delete */}
                        <form
                          action={async () => {
                            "use server";
                            await adminDeleteArticle(article.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-red-600 hover:text-red-800 transition-colors font-semibold"
                          >
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Users table */}
      <section>
        <div className="rule-top mb-4">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#999]">
            Usuarios Registrados
          </span>
        </div>
        <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                  {["Nombre", "Correo", "Rol", "Registro", "Acciones"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#999]"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-[#111]">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-[#666]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#999] text-xs whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {user.role === "USER" ? (
                        <form
                          action={async () => {
                            "use server";
                            await promoteUser(user.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-[#555] hover:text-[#111] transition-colors underline"
                          >
                            Promover a Admin
                          </button>
                        </form>
                      ) : (
                        <form
                          action={async () => {
                            "use server";
                            await demoteUser(user.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-orange-600 hover:text-orange-800 transition-colors underline"
                          >
                            Quitar Admin
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
