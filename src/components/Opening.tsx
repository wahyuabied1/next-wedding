import Image from "next/image";
import Reveal from "@/components/Reveal";
import { ENV_CLIP, Layers, type Layer } from "@/components/SceneLayers";

/* Bagian pembuka: ayat di atas oval renda, amplop terbuka, jumbai dan rangkaian bunga di atas tirai.
   Kanvas 500 x 950; posisi lapisan dalam persen sehingga proporsinya tetap. */

// urutan = urutan tumpukan (bawah ke atas)
const LAYERS: Layer[] = [
  { name: "hang", x: 7.418, y: 10.869, w: 43.676, px: [437, 739] },
  { name: "back", x: 15.6, y: 48.632, w: 68.4, px: [684, 717] },
  { name: "lining", x: 16.4, y: 33.684, w: 66.8, px: [668, 1188], clip: ENV_CLIP },
  { name: "front", x: 15.34, y: 63.672, w: 68.72, px: [687, 433] },
  { name: "oval", x: 16.072, y: 15.956, w: 66.113, px: [661, 941] },
  { name: "mound", x: 48.6, y: 66.132, w: 50.1, px: [501, 412] },
  { name: "hang", x: 11.96, y: 23.02, w: 22.42, px: [437, 739] },
  { name: "hang", x: 27.16, y: 14.18, w: 22.42, px: [437, 739] },
  { name: "tassel", x: 43.6, y: 57.158, w: 12.8, px: [128, 263] },
  { name: "butterfly", x: 36.22, y: 13.775, w: 10.664, px: [107, 101], animated: true },
];

export default function Opening() {
  return (
    <section id="opening" className="opening">
      <div className="stage">
        <div className="canvas">
          <Image
            className="stage-bg"
            src="/bg/curtain.webp"
            alt=""
            width={900}
            height={1352}
            sizes="(max-width: 500px) 163vw, 813px"
            style={{ left: "-37.4%", top: "-4.5%", width: "162.6%" }}
            aria-hidden="true"
          />
          <Layers layers={LAYERS} />
          <Reveal className="verse">
            <p>
              &quot;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari
              jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
              kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi
              kaum yang berpikir.&quot;
            </p>
            <p className="verse-ref">QS Ar-Rum 21</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
