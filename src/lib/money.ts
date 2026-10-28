export function formatPrice(cents: number): string {
  if (cents <= 0) return "Grátis";
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
