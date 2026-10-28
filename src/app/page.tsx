import Link from "next/link";
import { formatPrice } from "@/lib/money";
import { coverUrl, listProducts } from "@/lib/products";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function HomePage() {
  const products = await listProducts();
  const store = products.filter((p) => !p.included_in_app);
  const bundled = products.find((p) => p.included_in_app);

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

      <div className="grid">
        {store.map((product) => (
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
                <span className="price">{formatPrice(product.price_cents)}</span>
                <AddToCartButton productId={product.id} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
