"use client";
import { useBanSocket } from "@/hooks/useBanSocket";

export default function BanListener({ userId }: { userId: number }) {
  useBanSocket(userId);
  return null;
}
