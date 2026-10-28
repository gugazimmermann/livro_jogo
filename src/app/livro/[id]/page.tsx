import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/money";
import { coverUrl, getProduct } from "@/lib/products";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <main className="detail">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={coverUrl(product)} alt={product.title} />
      <div>
        <Link href="/" className="muted">
          ← Catálogo
        </Link>
        <h1>{product.title}</h1>
        <p className="muted">{product.subtitle}</p>
        <p>{product.blurb}</p>
        <p className="price" style={{ fontSize: "1.25rem" }}>
          {formatPrice(product.price_cents)}
        </p>
        {product.starter_inventory.length > 0 ? (
          <p className="muted">
            Inventário inicial: {product.starter_inventory.join(", ")}
          </p>
        ) : null}
        <div style={{ marginTop: "1.25rem" }}>
          <AddToCartButton
            productId={product.id}
            includedInApp={product.included_in_app}
          />
        </div>
      </div>
    </main>
  );
}
