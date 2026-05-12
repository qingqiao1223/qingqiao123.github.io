import Image from "next/image";
import Link from "next/link";
import type { ProductWithCover } from "@/types/product";
import { formatPriceYuan, cn } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductWithCover }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-primary/40"
    >
      <div className="relative h-28 w-28 shrink-0 bg-slate-100 sm:h-32 sm:w-32">
        {product.cover_url ? (
          <Image
            src={product.cover_url}
            alt=""
            fill
            className="object-cover"
            sizes="128px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            无图
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <div>
          <h2 className="line-clamp-2 text-sm font-medium text-slate-900">
            {product.title}
          </h2>
          <p className="mt-1 text-xs text-slate-500">{product.category}</p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-primary">
            {formatPriceYuan(product.price)}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              product.status === "在售" && "bg-emerald-50 text-emerald-800",
              product.status === "已预订" && "bg-amber-50 text-amber-900",
              product.status === "已售出" && "bg-slate-100 text-slate-700",
            )}
          >
            {product.status}
          </span>
        </div>
      </div>
    </Link>
  );
}
