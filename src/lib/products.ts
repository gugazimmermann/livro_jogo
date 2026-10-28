import { FALLBACK_PRODUCTS } from "./products-fallback";
import { createClient } from "./supabase/server";
import type { Product } from "./types";

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    title: String(row.title),
    subtitle: String(row.subtitle ?? ""),
    blurb: String(row.blurb ?? ""),
    price_cents: Number(row.price_cents ?? 0),
    accent: String(row.accent ?? "amber"),
    cover_path: (row.cover_path as string | null) ?? null,
    package_path: String(row.package_path),
    included_in_app: Boolean(row.included_in_app),
    starter_inventory: Array.isArray(row.starter_inventory)
      ? (row.starter_inventory as string[])
      : [],
    sort_order: Number(row.sort_order ?? 0),
  };
}

export async function listProducts(): Promise<Product[]> {
  const supabase = await createClient();
  if (!supabase) return FALLBACK_PRODUCTS;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return FALLBACK_PRODUCTS;
  return data.map((row) => mapRow(row as Record<string, unknown>));
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await listProducts();
  return products.find((p) => p.id === id) ?? null;
}

export function coverUrl(product: Product): string {
  return `/covers/${product.id}.jpg`;
}
