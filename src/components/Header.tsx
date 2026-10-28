"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function Header({ email }: { email?: string | null }) {
  const { count } = useCart();

  return (
    <header className="site-header">
      <Link href="/" className="brand">
        Livros-Jogo
      </Link>
      <nav className="nav">
        <Link href="/">Catálogo</Link>
        <Link href="/carrinho">
          Carrinho
          {count > 0 ? <span className="badge">{count}</span> : null}
        </Link>
        {email ? (
          <Link href="/conta">{email}</Link>
        ) : (
          <Link href="/entrar">Entrar</Link>
        )}
      </nav>
    </header>
  );
}
