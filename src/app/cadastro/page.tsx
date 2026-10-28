"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!isSupabaseConfigured()) {
      setError("Configure NEXT_PUBLIC_SUPABASE_URL e ANON_KEY em .env.local");
      return;
    }
    const supabase = createClient();
    if (!supabase) return;
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }
    setInfo(
      "Conta criada. Se a confirmação por e-mail estiver ativa, verifique sua caixa de entrada e depois entre.",
    );
  }

  return (
    <main className="panel">
      <h1>Criar conta</h1>
      <p className="muted">
        Este e-mail será o mesmo no aplicativo Flutter para baixar os livros.
      </p>
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor="password">Senha (mín. 6)</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        {error ? <p className="msg error">{error}</p> : null}
        {info ? <p className="msg ok">{info}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Criando…" : "Cadastrar"}
        </button>
      </form>
      <p className="muted" style={{ marginTop: "1rem" }}>
        Já tem conta? <Link href="/entrar">Entrar</Link>
      </p>
    </main>
  );
}
