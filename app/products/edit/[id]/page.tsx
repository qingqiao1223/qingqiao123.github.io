import { ProductForm, type ProductFormInitial } from "@/components/ProductForm";
import { getAuthUser, getProfile } from "@/lib/auth";
import { createServerClient } from "@/lib/pocketbase/server";
import type { ProductCategory } from "@/lib/constants";
import { notFound, redirect } from "next/navigation";

export const runtime = "edge";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const user = await getAuthUser();
  const profile = await getProfile();
  if (!user || !profile) redirect(`/login?next=/products/edit/${id}`);
  if (profile.is_banned) redirect("/me?banned=1");

  const pb = await createServerClient();
  let product;
  try {
    product = await pb.collection("products").getOne(id);
  } catch {
    notFound();
  }

  if (product.seller_id !== user.id && !profile.is_admin) notFound();

  const images: { image_url: string }[] = (
    product.images || []
  ).map((filename: string) => ({
    image_url: pb.files.getUrl(product, filename),
  }));

  const initial: ProductFormInitial = {
    productId: product.id,
    title: product.title,
    description: product.description ?? "",
    price: Number(product.price),
    category: product.category as ProductCategory,
    condition: product.condition as ProductFormInitial["condition"],
    status: product.status as ProductFormInitial["status"],
    contact_note: product.contact_note ?? "",
    images,
  };

  return (
    <main className="min-h-[60vh]">
      <ProductForm mode="edit" initial={initial} />
    </main>
  );
}
