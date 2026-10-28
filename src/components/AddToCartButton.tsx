"use client";

import { useCart } from "@/lib/cart";

export function AddToCartButton({
  productId,
  includedInApp,
}: {
  productId: string;
  includedInApp?: boolean;
}) {
  const { ids, add } = useCart();
  if (includedInApp) {
    return <span className="chip">Incluído no app</span>;
  }
  const inCart = ids.includes(productId);
  return (
    <button
      type="button"
      className={inCart ? "btn" : "btn btn-primary"}
      onClick={() => add(productId)}
      disabled={inCart}
    >
      {inCart ? "No carrinho" : "Adicionar ao carrinho"}
    </button>
  );
}
