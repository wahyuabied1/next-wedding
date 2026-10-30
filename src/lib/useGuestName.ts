"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

const getSnapshot = () => new URLSearchParams(window.location.search).get("to")?.trim() ?? "";
const getServerSnapshot = () => "";

/** Nama tamu dari ?to=Nama+Tamu (kosong saat render server). */
export function useGuestName(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
