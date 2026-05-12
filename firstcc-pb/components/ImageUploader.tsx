"use client";

import { useEffect, useRef, useState } from "react";

const MAX_FILES = 5;
const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export type PickedImage =
  | { kind: "file"; file: File }
  | { kind: "remote"; url: string };

function FilePreview({ file }: { file: File }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  if (!url) return <div className="h-full w-full animate-pulse bg-slate-200" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="h-full w-full object-cover" />
  );
}

export function ImageUploader({
  items,
  onChange,
}: {
  items: PickedImage[];
  onChange: (next: PickedImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);
    const next = [...items];
    for (const file of Array.from(fileList)) {
      if (next.length >= MAX_FILES) {
        setError(`最多 ${MAX_FILES} 张图片`);
        break;
      }
      if (!ACCEPT.includes(file.type)) {
        setError("仅支持 jpg、jpeg、png、webp");
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError("单张图片最大 2MB");
        continue;
      }
      next.push({ kind: "file", file });
    }
    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    const next = items.filter((_, i) => i !== index);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">商品图片</label>
      <p className="text-xs text-slate-500">
        最多 {MAX_FILES} 张，单张不超过 2MB，支持 jpg / png / webp。
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={items.length >= MAX_FILES}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
      >
        选择图片
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {items.map((item, idx) => (
          <li
            key={
              item.kind === "file"
                ? `f-${idx}-${item.file.name}-${item.file.size}`
                : `r-${idx}-${item.url}`
            }
            className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {item.kind === "file" ? (
              <FilePreview file={item.file} />
            ) : (
              <img src={item.url} alt="" className="h-full w-full object-cover" />
            )}
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute right-1 top-1 rounded bg-black/60 px-1.5 text-xs text-white"
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
