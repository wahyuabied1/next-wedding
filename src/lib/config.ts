// Semua konten undangan ada di sini. Ubah teks/tanggal/rekening cukup di file ini.

export const site = {
  url: "https://abidfifi.live",
  title: "The Wedding of Fifi & Abid",
  description:
    "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir di pernikahan Fifi & Abid, Sabtu 28 November 2026 di Hall Muzdalifah Asrama Haji Surabaya.",
  // Gambar pratinjau saat tautan dibagikan (WhatsApp/Facebook/dll.). Dibuat dari photo-000 oleh
  // `npm run og` (1200x630, di bawah 300 KB). Ganti fotonya: `node scripts/generate-og-image.mjs <nama-foto>`.
  ogImage: { src: "/og-image.jpg", width: 1200, height: 630 },
};

// Semua `photo` di bawah = nama file di public/photos TANPA ekstensi (.jpg/.jpeg/.png/.webp/.avif/.gif).
export const couple = {
  bride: {
    name: "Refiana Dwi Maghfiroh",
    degree: "S.M., M.M",
    parents: ["Putri Kedua dari", "Bpk. Pardiyono", "& Ibu Warsini"],
    photo: "photo-1",
  },
  groom: {
    name: "Wahyu Abid Arifiyanto",
    degree: "S.Tr.Kom.",
    parents: ["Putra Kedua dari", "Bpk. H. Supriyanto (Alm)", "& Ibu Hj. Eni Solikhah, S.Pd"],
    photo: "photo-3",
  },
  together: { photo: "photo-000" },
  families: {
    bride: { label: "FIFI", parents: ["Bpk. Pardiyono", "Ibu Warsini"] },
    groom: { label: "ABID", parents: ["Bpk. H. Supriyanto (Alm)", "Ibu Hj. Eni Solikhah, S.Pd"] },
  },
};

export const venue = {
  name: "Hall Muzdalifah Asrama Haji Surabaya",
  address: "Jl. Manyar Kertoadi, Klampis Ngasem, Kec. Sukolilo, Surabaya, Jawa Timur 60116",
  mapUrl:
    "https://www.google.com/maps/place/Gedung+Muzdalifah/@-7.2853015,112.7791851,759m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2dd7fb014862d7bb:0xde81824696179878!8m2!3d-7.2853015!4d112.7791851!16s%2Fg%2F11twh8vyfg?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D",
};

export type WeddingEvent = {
  key: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  start: string; // ISO dengan zona waktu
  end: string;
};

export const events: WeddingEvent[] = [
  {
    key: "akad",
    title: "Akad Nikah",
    dateLabel: "Sabtu, 28 November 2026",
    timeLabel: "15.00 WIB",
    start: "2026-11-28T15:00:00+07:00",
    end: "2026-11-28T16:30:00+07:00",
  },
  {
    key: "resepsi",
    title: "Resepsi",
    dateLabel: "Sabtu, 28 November 2026",
    timeLabel: "18.00 WIB",
    start: "2026-11-28T18:00:00+07:00",
    end: "2026-11-28T21:00:00+07:00",
  },
];

// Hitung mundur menuju acara pertama (Akad Nikah).
export const countdownTarget = events[0].start;

export function calendarUrl(event: WeddingEvent): string {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} Fifi & Abid`,
    dates: `${fmt(event.start)}/${fmt(event.end)}`,
    details: `${event.title} Fifi & Abid. ${event.dateLabel}, ${event.timeLabel}.`,
    location: `${venue.name}, ${venue.address}`,
    ctz: "Asia/Jakarta",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export const gift = {
  bank: {
    logo: "/img/logo-bca.png",
    number: "6750850519",
    holder: "REFIANA DWI",
  },
  address: {
    label: "Alamat Kirim Kado",
    value: "Pandugo Baru G-20, Penjaringansari, Rungkut, Surabaya 60297",
  },
  whatsapp: {
    phone: "6287855937298",
    text: "Hallo, aku kirim hadiah nih untuk bulan madu. Selamat berbulan madu ya!",
  },
};

// Galeri otomatis berisi SEMUA foto di public/photos, kecuali yang tercantum di sini
// (nama file tanpa ekstensi). Foto yang sudah tampil di bagian "Kedua Mempelai"
// (bingkai berdua + potret Fifi + potret Abid) tidak diulang di galeri.
export const galleryExclude: string[] = [couple.together.photo, couple.bride.photo, couple.groom.photo];

// Foto yang ditampilkan paling depan di galeri (urutan sisanya mengikuti nama file).
export const galleryFirst: string[] = ["photo-couple"];

// Pasangan foto yang ditukar posisinya, berurutan setelah urutan di atas:
// 1) photo-7 dan photo-couple, 2) photo-7 dan photo-8 (jadi photo-8 di depan, photo-7 di urutan ke-10),
// 3) photo-couple dan photo-004 (jadi photo-couple di urutan ke-6, photo-004 di urutan ke-9),
// 4) photo-22 dan photo-21 (saling bertukar tempat).
export const gallerySwaps: [string, string][] = [
  ["photo-7", "photo-couple"],
  ["photo-7", "photo-8"],
  ["photo-couple", "photo-004"],
  ["photo-22", "photo-21"],
];

// Daftar lagu, dicoba berurutan: file yang tidak ada dilewati otomatis, jadi lagu pertama
// yang benar-benar ada di public/audio yang diputar. Taruh MP3 baru di urutan paling atas.
export const audioSources = ["/audio/love-story.mp3", "/audio/song.mp3"];
