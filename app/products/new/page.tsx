import { ProductForm } from "@/components/ProductForm";
import { getProfile } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/products/new");
  if (profile.is_banned) redirect("/me?banned=1");

  return (
    <main className="min-h-[60vh]">
      <ProductForm mode="create" />
    </main>
  );
}
