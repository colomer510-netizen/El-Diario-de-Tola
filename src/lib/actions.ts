"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Todos los campos son requeridos." };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Este correo ya está registrado." };
  }

  const password_hash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, password_hash },
  });

  redirect("/login?registered=1");
}

// ─────────────────────────────────────────────
// CREATE ARTICLE
// ─────────────────────────────────────────────
export async function createArticle(formData: FormData, userId: string) {
  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const category = formData.get("category") as string;
  const is_anonymous = formData.get("is_anonymous") === "true";

  if (!title || !excerpt || !content || !category) {
    return { error: "Todos los campos son requeridos." };
  }
  if (content.length > 2000) {
    return { error: "El contenido no puede superar los 2000 caracteres." };
  }
  if (excerpt.length > 300) {
    return { error: "El extracto no puede superar los 300 caracteres." };
  }

  const article = await prisma.article.create({
    data: { title, excerpt, content, category, is_anonymous, authorId: userId },
  });

  redirect(`/articles/${article.id}`);
}

// ─────────────────────────────────────────────
// DELETE ARTICLE (admin or own article)
// ─────────────────────────────────────────────
export async function deleteArticle(articleId: string) {
  await prisma.article.delete({ where: { id: articleId } });
  redirect("/dashboard");
}

// ─────────────────────────────────────────────
// ADMIN: delete any article
// ─────────────────────────────────────────────
export async function adminDeleteArticle(articleId: string) {
  await prisma.article.delete({ where: { id: articleId } });
}

// ─────────────────────────────────────────────
// ADMIN: toggle published
// ─────────────────────────────────────────────
export async function togglePublished(articleId: string, current: boolean) {
  await prisma.article.update({
    where: { id: articleId },
    data: { published: !current },
  });
}

// ─────────────────────────────────────────────
// ADMIN: promote user to ADMIN
// ─────────────────────────────────────────────
export async function promoteUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { role: "ADMIN" },
  });
}

// ─────────────────────────────────────────────
// ADMIN: demote user to USER
// ─────────────────────────────────────────────
export async function demoteUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { role: "USER" },
  });
}

// Login action
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch {
    return { error: "Correo o contraseña incorrectos." };
  }
}
