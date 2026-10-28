import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CATEGORY_ORDER, categoryLabel } from "@/lib/categories";
import { formatPrice } from "@/lib/money";
import { coverUrl, listProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export default async function HomePage() {
  const products = await listProducts();
  const store = products.filter((p) => !p.included_in_app);
  const bundled = products.find((p) => p.included_in_app);

  const byCategory = new Map<string, Product[]>();
  for (const product of store) {
    const key = product.category || "fantasia";
    const list = byCategory.get(key) ?? [];
    list.push(product);
    byCategory.set(key, list);
  }

  const sections: { id: string; label: string; items: Product[] }[] =
    CATEGORY_ORDER.filter((id) => (byCategory.get(id)?.length ?? 0) > 0).map(
      (id) => ({
        id,
        label: categoryLabel(id),
        items: byCategory.get(id)!,
      }),
    );

  // Any unknown categories last
  for (const [id, items] of byCategory) {
    if (!(CATEGORY_ORDER as readonly string[]).includes(id)) {
      sections.push({ id, label: categoryLabel(id), items });
    }
  }

  return (
    <main>
      <section className="hero">
        <h1>Aventuras para colecionar</h1>
        <p>
          Monte seu carrinho na loja. Checkout gratuito por enquanto — as
          compras aparecem no app quando você entra com o mesmo e-mail.
          {bundled
            ? ` "${bundled.title}" já vem incluso no aplicativo.`
            : null}
        </p>
      </section>

      {sections.map((section) => (
        <section key={section.id} className="catalog-section">
          <h2 className="catalog-section-title">{section.label}</h2>
          <div className="grid">
            {section.items.map((product) => (
              <article key={product.id} className="card">
                <Link href={`/livro/${product.id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="card-cover"
                    src={coverUrl(product)}
                    alt={product.title}
                  />
                </Link>
                <div className="card-body">
                  <h2>
                    <Link href={`/livro/${product.id}`}>{product.title}</Link>
                  </h2>
                  <div className="sub">{product.subtitle}</div>
                  <p className="blurb">{product.blurb}</p>
                  <div className="row">
                    <span className="price">
                      {formatPrice(product.price_cents)}
                    </span>
                    <AddToCartButton productId={product.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
