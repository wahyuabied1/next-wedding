import { Redis } from "@upstash/redis";

export type Attendance = "hadir" | "tidak";

export type Rsvp = {
  id: string;
  name: string;
  message: string;
  attendance: Attendance;
  guests: number;
  createdAt: number;
};

const HASH = "rsvp:items";

// Vercel Marketplace (Upstash) menyuntikkan salah satu pasangan env ini.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

// Fallback memori hanya untuk development lokal tanpa Redis.
const mem = globalThis as unknown as {
  __rsvp?: Map<string, Rsvp>;
  __rsvpRl?: Map<string, number>;
};
mem.__rsvp ??= new Map();
mem.__rsvpRl ??= new Map();

export const storeConfigured = redis !== null || process.env.NODE_ENV !== "production";

export async function listRsvps(): Promise<Rsvp[]> {
  let items: Rsvp[];
  if (redis) {
    const all = await redis.hgetall<Record<string, Rsvp>>(HASH);
    items = all ? Object.values(all) : [];
  } else {
    items = [...mem.__rsvp!.values()];
  }
  return items.sort((a, b) => b.createdAt - a.createdAt);
}

export async function addRsvp(item: Rsvp): Promise<void> {
  if (redis) await redis.hset(HASH, { [item.id]: item });
  else mem.__rsvp!.set(item.id, item);
}

export async function deleteRsvp(id: string): Promise<boolean> {
  if (redis) return (await redis.hdel(HASH, id)) > 0;
  return mem.__rsvp!.delete(id);
}

/** true = boleh lanjut, false = terlalu cepat (1 kiriman / 15 detik / IP). */
export async function allowPost(ip: string): Promise<boolean> {
  const key = `rsvp:rl:${ip}`;
  if (redis) {
    const ok = await redis.set(key, 1, { nx: true, ex: 15 });
    return ok === "OK";
  }
  const now = Date.now();
  const last = mem.__rsvpRl!.get(key) ?? 0;
  if (now - last < 15_000) return false;
  mem.__rsvpRl!.set(key, now);
  return true;
}
