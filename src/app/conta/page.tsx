"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) return;
      const supabase = createClient();
      if (!supabase) return;
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.replace("/entrar");
        return;
      }
      setEmail(auth.user.email ?? null);
      const { data } = await supabase
        .from("purchases")
        .select("product_id")
        .eq("user_id", auth.user.id);
      setPurchases((data ?? []).map((r) => r.product_id as string));
    }
    void load();
  }, [router]);

  async function signOut() {
    const supabase = createClient();
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <main className="panel">
      <h1>Conta</h1>
      <p>
        E-mail: <strong>{email ?? "…"}</strong>
      </p>
      <p className="muted">Livros adquiridos (aparecem no app após login):</p>
      <ul>
        {purchases.length === 0 ? (
          <li className="muted">Nenhuma compra ainda.</li>
        ) : (
          purchases.map((id) => <li key={id}>{id}</li>)
        )}
      </ul>
      <button type="button" className="btn" onClick={() => void signOut()}>
        Sair
      </button>
    </main>
  );
}
