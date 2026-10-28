import type { Metadata } from "next";
import { Libre_Baskerville, Source_Sans_3 } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const display = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-display-loaded",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body-loaded",
});

export const metadata: Metadata = {
  title: "Livros-Jogo — Loja",
  description: "Compre aventuras e jogue no app com o mesmo e-mail.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  let email: string | null = null;
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? null;
  }

  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${body.variable}`}>
        <CartProvider>
          <div className="shell">
            <Header email={email} />
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
