export type Product = {
  id: string;
  title: string;
  subtitle: string;
  blurb: string;
  price_cents: number;
  accent: string;
  category: string;
  cover_path: string | null;
  package_path: string;
  included_in_app: boolean;
  starter_inventory: string[];
  sort_order: number;
};

export type CartItem = {
  productId: string;
};
