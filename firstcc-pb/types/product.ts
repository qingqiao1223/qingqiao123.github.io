import type { ProductCategory, ProductCondition, ProductStatus } from "@/lib/constants";

export type ProductWithCover = {
  id: string;
  title: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  status: ProductStatus;
  view_count: number;
  created_at: string;
  cover_url: string | null;
};
