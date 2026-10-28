"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { FALLBACK_PRODUCTS } from "@/lib/products-fallback";
import type { Product } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/money";

export default function CartPage() {
  const { ids, remove, clear } = useCart();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) return;
      const { data } = await supabase.from("products").select("*").order("sort_order");
      if (data?.length) {
        setProducts(
          data.map((row) => ({
            id: row.id as string,
            title: row.title as string,
            subtitle: (row.subtitle as string) ?? "",
            blurb: (row.blurb as string) ?? "",
            price_cents: (row.price_cents as number) ?? 0,
            accent: (row.accent as string) ?? "amber",
            cover_path: (row.cover_path as string | null) ?? null,
            package_path: row.package_path as string,
            included_in_app: Boolean(row.included_in_app),
            starter_inventory: (row.starter_inventory as string[]) ?? [],
            sort_order: (row.sort_order as number) ?? 0,
          })),
        );
      }
    }
    void load();
  }, []);

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  async function checkout() {
    setError(null);
    setMessage(null);
    const supabase = createClient();
    if (!supabase) {
      setError("Configure o Supabase em .env.local para concluir o checkout.");
      return;
    }
    setBusy(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      setError("Faça login antes do checkout.");
      return;
    }

    // TODO(stripe): replace free inserts with Stripe Checkout Session + webhook.
    const rows = items
      .filter((p) => !p.included_in_app)
      .map((p) => ({
        user_id: user.id,
        product_id: p.id,
        payment_provider: "free",
      }));

    if (!rows.length) {
      setBusy(false);
      setError("Carrinho vazio ou só itens já inclusos no app.");
      return;
    }

    const { error: err } = await supabase.from("purchases").upsert(rows, {
      onConflict: "user_id,product_id",
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    clear();
    setMessage(
      "Pronto! Abra o app, entre com este e-mail e sincronize para baixar os livros.",
    );
  }

  return (
    <main>
      <h1 style={{ fontFamily: "var(--font-display)" }}>Carrinho</h1>
      {items.length === 0 ? (
        <p className="muted">
          Seu carrinho está vazio. <Link href="/">Ver catálogo</Link>
        </p>
      ) : (
        <>
          <div className="cart-list">
            {items.map((p) => (
              <div key={p.id} className="cart-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/covers/${p.id}.jpg`} alt="" />
                <div>
                  <strong>{p.title}</strong>
                  <div className="muted">{formatPrice(p.price_cents)}</div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => remove(p.id)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
          <div className="row" style={{ justifyContent: "flex-start", gap: "1rem" }}>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={() => void checkout()}
            >
              {busy ? "Processando…" : "Finalizar grátis"}
            </button>
            <Link href="/entrar" className="btn">
              Entrar / cadastrar
            </Link>
          </div>
          <p className="muted" style={{ marginTop: "1rem" }}>
            Pagamento Stripe será ligado depois; por agora a aquisição é gratuita.
          </p>
        </>
      )}
      {error ? <p className="msg error">{error}</p> : null}
      {message ? <p className="msg ok">{message}</p> : null}
    </main>
  );
}
