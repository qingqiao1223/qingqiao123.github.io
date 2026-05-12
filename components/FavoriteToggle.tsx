"use client";

import { createClient } from "@/lib/pocketbase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function FavoriteToggle({
  productId,
  initialFavorite,
  disabled,
}: {
  productId: string;
  initialFavorite: boolean;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [fav, setFav] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (disabled || loading) return;
    setLoading(true);
    const pb = createClient();
    if (!pb.authStore.isValid) {
      setLoading(false);
      return;
    }
    try {
      if (fav) {
        const records = await pb.collection("favorites").getFullList({
          filter: `user_id = "${pb.authStore.model!.id}" && product_id = "${productId}"`,
        });
        for (const r of records) {
          await pb.collection("favorites").delete(r.id);
        }
        setFav(false);
      } else {
        await pb.collection("favorites").create({
          user_id: pb.authStore.model!.id,
          product_id: productId,
        });
        setFav(true);
      }
    } catch {
      // ignore
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled || loading}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50"
    >
      {fav ? "已收藏" : "收藏"}
    </button>
  );
}
