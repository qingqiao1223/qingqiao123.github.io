"use client";

import PocketBase from "pocketbase";

let pb: PocketBase | null = null;

export function createClient(): PocketBase {
  if (!pb) {
    pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090");
  }
  return pb;
}
