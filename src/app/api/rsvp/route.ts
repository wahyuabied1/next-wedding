import { randomUUID, timingSafeEqual } from "node:crypto";
import {
  addRsvp,
  allowPost,
  deleteRsvp,
  listRsvps,
  storeConfigured,
  type Attendance,
} from "@/lib/rsvp-store";

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  if (!storeConfigured) return json({ error: "Penyimpanan belum dikonfigurasi." }, 503);
  const items = await listRsvps();
  return json({
    items: items.slice(0, 200),
    hadir: items.filter((i) => i.attendance === "hadir").length,
    tidak: items.filter((i) => i.attendance === "tidak").length,
    total: items.length,
  });
}

export async function POST(request: Request) {
  if (!storeConfigured) return json({ error: "Penyimpanan belum dikonfigurasi." }, 503);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Permintaan tidak valid." }, 400);
  }

  // Honeypot: bot biasanya mengisi semua field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true }, 201);
  }

  const attendance = body.attendance;
  if (attendance !== "hadir" && attendance !== "tidak") {
    return json({ error: "Mohon konfirmasi kehadiran anda." }, 400);
  }

  const name = String(body.name ?? "").trim().slice(0, 60) || "Tamu";
  const message = String(body.message ?? "").trim().slice(0, 500);
  const guests = attendance === "hadir" && Number(body.guests) === 2 ? 2 : 1;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!(await allowPost(ip))) {
    return json({ error: "Terlalu cepat, coba lagi sebentar lagi." }, 429);
  }

  const item = {
    id: randomUUID(),
    name,
    message,
    attendance: attendance as Attendance,
    guests,
    createdAt: Date.now(),
  };
  await addRsvp(item);
  return json({ item }, 201);
}

// Hapus komentar (moderasi): DELETE /api/rsvp?id=<id> dengan header Authorization: Bearer <ADMIN_TOKEN>
export async function DELETE(request: Request) {
  const expected = process.env.ADMIN_TOKEN;
  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected ?? "");
  if (!expected || a.length !== b.length || !timingSafeEqual(a, b)) {
    return json({ error: "Tidak diizinkan." }, 401);
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ error: "Parameter id wajib." }, 400);
  const removed = await deleteRsvp(id);
  return json({ removed }, removed ? 200 : 404);
}
