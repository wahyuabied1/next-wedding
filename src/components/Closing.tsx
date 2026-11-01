import Image from "next/image";
import Reveal from "@/components/Reveal";
import { ENV_CLIP, Layers, type Layer } from "@/components/SceneLayers";
import { couple } from "@/lib/config";

/* Penutup: oval marun berornamen di atas amplop terbuka dan tirai, dua rangkaian bunga menggantung.
   Kanvas 500 x 941; di bawahnya daftar keluarga besar. */

// urutan = urutan tumpukan (bawah ke atas)
const LAYERS: Layer[] = [
  { name: "back", x: 15.6, y: 52.815, w: 68.4, px: [684, 717] },
  { name: "lining", x: 16.4, y: 37.726, w: 66.8, px: [668, 1188], clip: ENV_CLIP },
  { name: "front", x: 15.342, y: 68, w: 68.721, px: [687, 433] },
  { name: "mound", x: 46.192, y: 70.44, w: 52.448, px: [501, 412] },
  { name: "flora2", x: 66.431, y: -6.321, w: 47.193, px: [472, 798], flip: true },
  { name: "oval2", x: 10.77, y: 12.501, w: 78.181, px: [782, 1208] },
  { name: "tassel2", x: 43, y: 66.206, w: 14, px: [140, 288] },
  { name: "butterfly", x: 61.36, y: 18.435, w: 13.072, px: [107, 101], animated: true },
  { name: "flora2", x: -11.624, y: -6.321, w: 47.193, px: [472, 798] },
];

export default function Closing() {
  return (
    <section id="penutup" className="closing">
      <div className="stage">
        <div className="canvas closing-canvas">
          <Image
            className="stage-bg"
            src="/bg/curtain.webp"
            alt=""
            width={900}
            height={1352}
            sizes="(max-width: 500px) 180vw, 901px"
            style={{ left: "-37.2%", top: "-7.23%", width: "180.2%" }}
            aria-hidden="true"
          />
          <Layers layers={LAYERS.slice(0, 6)} />
          <Reveal className="thanks">
            <p>Atas kehadiran dan Doa Restunya kami ucapkan terimakasih.</p>
            <p>Kami Yang Berbahagia, Keluarga Besar Kedua Mempelai</p>
            <h2 className="script thanks-names">
              <span>Fifi</span>
              <span>&amp;</span>
              <span>Abid</span>
            </h2>
          </Reveal>
          <Layers layers={LAYERS.slice(6)} />
        </div>
      </div>

      <Reveal className="families">
        <div>
          <p className="family-label">Keluarga Besar</p>
          <p className="family-name">{couple.families.bride.label}</p>
          {couple.families.bride.parents.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div>
          <p className="family-label">Keluarga Besar</p>
          <p className="family-name">{couple.families.groom.label}</p>
          {couple.families.groom.parents.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
