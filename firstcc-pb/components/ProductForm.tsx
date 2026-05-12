"use client";

import { createClient } from "@/lib/pocketbase/client";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  PRODUCT_STATUSES,
  PROHIBITED_ITEMS_TEXT,
} from "@/lib/constants";
import type {
  ProductCategory,
  ProductCondition,
  ProductStatus,
} from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploader, type PickedImage } from "@/components/ImageUploader";

export type ProductFormInitial = {
  productId: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  status: ProductStatus;
  contact_note: string;
  images: { image_url: string }[];
};

type Props =
  | { mode: "create"; initial?: undefined }
  | { mode: "edit"; initial: ProductFormInitial };

export function ProductForm(props: Props) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const initial = props.mode === "edit" ? props.initial : null;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [category, setCategory] = useState<ProductCategory>(
    initial?.category ?? PRODUCT_CATEGORIES[0],
  );
  const [condition, setCondition] = useState<ProductCondition>(
    initial?.condition ?? PRODUCT_CONDITIONS[0],
  );
  const [status, setStatus] = useState<ProductStatus>(
    initial?.status ?? "在售",
  );
  const [contactNote, setContactNote] = useState(initial?.contact_note ?? "");
  const [confirmSafe, setConfirmSafe] = useState(false);
  const [images, setImages] = useState<PickedImage[]>(() => {
    if (!initial?.images?.length) return [];
    return initial.images.map((img) => ({
      kind: "remote" as const,
      url: img.image_url,
    }));
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!confirmSafe) {
      setError("请确认不出售违禁品，并同意遵守平台规则");
      return;
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("请输入有效价格");
      return;
    }

    setLoading(true);
    const pb = createClient();
    if (!pb.authStore.isValid) {
      setError("请先登录");
      setLoading(false);
      return;
    }

    try {
      if (!isEdit) {
        const formData = new FormData();
        const user = pb.authStore.model;
        formData.append("seller_id", user!.id);
        formData.append("title", title.trim());
        formData.append("description", description.trim() || "");
        formData.append("price", String(priceNum));
        formData.append("category", category);
        formData.append("condition", condition);
        formData.append("status", status);
        formData.append("contact_note", contactNote.trim() || "");
        formData.append("view_count", "0");
        for (const item of images) {
          if (item.kind === "file") {
            formData.append("images", item.file);
          }
        }
        const record = await pb.collection("products").create(formData);
        router.push(`/products/${record.id}`);
        router.refresh();
        return;
      }

      const productId = initial!.productId;
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim() || "");
      formData.append("price", String(priceNum));
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("status", status);
      formData.append("contact_note", contactNote.trim() || "");

      // Remove images that were in the initial set but are no longer present
      if (initial!.images.length > 0) {
        const keptFilenames = new Set(
          images
            .filter((i) => i.kind === "remote")
            .map((i) => i.url.split("/").pop()!.split("?")[0]),
        );
        for (const oldImg of initial!.images) {
          const filename = oldImg.image_url.split("/").pop()!.split("?")[0];
          if (!keptFilenames.has(filename)) {
            formData.append("images (remove)", filename);
          }
        }
      }
      // Append new files
      for (const item of images) {
        if (item.kind === "file") {
          formData.append("images", item.file);
        }
      }
      await pb.collection("products").update(productId, formData);
      router.push(`/products/${productId}`);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "保存失败";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-2xl space-y-5 px-4 py-8"
    >
      <h1 className="text-2xl font-semibold text-slate-900">
        {isEdit ? "编辑商品" : "发布商品"}
      </h1>

      {/* 标题 */}
      <div>
        <label className="text-sm font-medium text-slate-700">标题</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
        />
      </div>

      {/* 价格 */}
      <div>
        <label className="text-sm font-medium text-slate-700">价格（元）</label>
        <input
          required
          type="number"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
        />
      </div>

      {/* 分类与成色 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">分类</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">成色</label>
          <select
            value={condition}
            onChange={(e) =>
              setCondition(e.target.value as ProductCondition)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {PRODUCT_CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 状态-仅编辑 */}
      {isEdit && (
        <div>
          <label className="text-sm font-medium text-slate-700">状态</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {PRODUCT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 描述 */}
      <div>
        <label className="text-sm font-medium text-slate-700">描述</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
        />
      </div>

      {/* 联系说明 */}
      <div>
        <label className="text-sm font-medium text-slate-700">
          本商品联系说明（可选）
        </label>
        <textarea
          value={contactNote}
          onChange={(e) => setContactNote(e.target.value)}
          rows={2}
          placeholder="如：仅工作日中午面交"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
        />
      </div>

      <ImageUploader items={images} onChange={setImages} />

      {/* 禁止发布 */}
      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-900">禁止发布</p>
        <p className="mt-2 leading-relaxed">{PROHIBITED_ITEMS_TEXT}</p>
        <label className="mt-3 flex items-start gap-2">
          <input
            type="checkbox"
            checked={confirmSafe}
            onChange={(e) => setConfirmSafe(e.target.checked)}
            className="mt-1"
          />
          <span>我确认不出售上述违禁或违规商品，信息真实有效。</span>
        </label>
      </section>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "保存中…" : isEdit ? "保存修改" : "发布"}
      </button>
    </form>
  );
}
