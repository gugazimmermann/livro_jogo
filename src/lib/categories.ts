export const CATEGORY_ORDER = [
  "fantasia",
  "horror",
  "cyberpunk",
  "distopia",
] as const;

export type CategoryId = (typeof CATEGORY_ORDER)[number];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  fantasia: "Fantasia",
  horror: "Horror e sobrenatural",
  cyberpunk: "Cyberpunk e ficção",
  distopia: "Distopia",
};

export function categoryLabel(id: string): string {
  return CATEGORY_LABELS[id as CategoryId] ?? id;
}
