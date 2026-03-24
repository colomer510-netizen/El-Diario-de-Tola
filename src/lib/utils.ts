export const CATEGORIES = [
  { value: "local", label: "Local", color: "bg-blue-600" },
  { value: "politica", label: "Política", color: "bg-red-600" },
  { value: "economia", label: "Economía", color: "bg-amber-600" },
  { value: "seguridad", label: "Seguridad", color: "bg-orange-600" },
  { value: "cultura", label: "Cultura", color: "bg-purple-600" },
  { value: "deportes", label: "Deportes", color: "bg-green-600" },
  { value: "educacion", label: "Educación", color: "bg-teal-600" },
  { value: "salud", label: "Salud", color: "bg-rose-600" },
  { value: "tecnologia", label: "Tecnología", color: "bg-indigo-600" },
  { value: "comunidad", label: "Comunidad", color: "bg-cyan-600" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export function getCategoryColor(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.color ?? "bg-gray-600";
}

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
