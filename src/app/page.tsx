import Image from "next/image";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import Gift from "@/components/Gift";
import Invitation from "@/components/Invitation";
import LottieFill from "@/components/LottieFill";
import Reveal from "@/components/Reveal";
import Rsvp from "@/components/Rsvp";
import { calendarUrl, countdownTarget, couple, events, venue } from "@/lib/config";

function Person({ person }: { person: typeof couple.bride }) {
  return (
    <Reveal className="person">
      <Image
        className="oval"
        src={person.photo}
        alt={person.name}
        width={person.width}
        height={person.height}
        sizes="300px"
      />
      <span className="vline" aria-hidden="true" />
      <h3 className="script name">{person.name}</h3>
      {person.parents.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </Reveal>
  );
}

export default function Home() {
  return (
    <Invitation>
      <section id="opening" className="opening">
        <LottieFill className="lt lt-gate" src="/lottie/gerbang-5-1.json" />
        <Reveal className="opening-text">
          <p>
            Tanpa mengurangi rasa hormat, kami bermaksud mengundang bapak / ibu / saudara/i untuk berhadir pada acara
            kami.
          </p>
        </Reveal>
      </section>

      <section id="mempelai" className="section dark">
        <Reveal>
          <h2 className="script heading">Kedua Mempelai</h2>
          <p className="lead">Kami Nantikan Kehadiran Para Keluarga Dan Sahabat, Untuk Menjadi Saksi Di Hari Yang Bahagia.</p>
        </Reveal>

        <Reveal className="frame">
          <Image
            src={couple.together.photo}
            alt="Fifi & Abid"
            width={couple.together.width}
            height={couple.together.height}
            sizes="(max-width: 500px) 90vw, 450px"
            priority
          />
        </Reveal>

        <Reveal>
          <p className="lead doa">
            Maha Suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah dan
            Ridhoilah Pernikahan Kami.
          </p>
        </Reveal>

        <Person person={couple.bride} />
        <Person person={couple.groom} />
      </section>

      <section id="acara" className="section events">
        <Reveal>
          <h2 className="script heading big">Wedding Day</h2>
          <p className="the-date">
            <span />
            The Date
            <span />
          </p>
          <Countdown target={countdownTarget} />
        </Reveal>

        {events.map((event) => (
          <Reveal key={event.key} className="event-card">
            <h3 className="event-title">
              <span />
              {event.title}
              <span />
            </h3>
            <p className="event-date">{event.dateLabel}</p>
            <p className="event-date">{event.timeLabel}</p>
            <p className="event-venue">{venue.name}</p>
            <p className="event-address">{venue.address}</p>
            <a className="btn-white" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z" />
              </svg>
              OPEN MAP
            </a>
            <a className="btn-white" href={calendarUrl(event)} target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V9h14v11zm-9.2-3.2l-2-2 1.4-1.4.6.6 3-3 1.4 1.4-4.4 4.4z" />
              </svg>
              SAVE THE DATE
            </a>
          </Reveal>
        ))}
      </section>

      <section id="galeri" className="section gallery-section">
        <Reveal>
          <h2 className="script heading">Our Moments</h2>
          <p className="lead quote">&quot; A happy marriage is a long conversation which always seems too short&quot;.</p>
        </Reveal>
        <Gallery />
        <Image className="deco deco-flowers" src="/bg/deco-flowers.webp" alt="" width={478} height={612} aria-hidden="true" />
        <Image className="deco deco-peacock" src="/bg/deco-peacock.webp" alt="" width={306} height={615} aria-hidden="true" />
      </section>

      <section id="rsvp" className="section dark">
        <LottieFill className="divider" src="/lottie/Outline-Divider-11.json" />
        <Reveal>
          <h2 className="script heading">
            Rsvp
            <br />
            Doa &amp; Ucapan
          </h2>
        </Reveal>
        <Rsvp />

        <LottieFill className="divider" src="/lottie/Outline-Divider-11.json" />
        <Reveal>
          <h2 className="script heading">Wedding Gift</h2>
          <p className="lead">
            Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda
            kasih Anda, Anda dapat memberi kado secara cashless.
          </p>
        </Reveal>
        <Gift />
      </section>

      <section className="closing">
        <LottieFill className="lt lt-closing-a" src="/lottie/bunga-3-2.json" />
        <LottieFill className="lt lt-closing-b" src="/lottie/bunga-2-2.json" />
        <Reveal className="closing-card">
          <p>Atas kehadiran dan Doa Restunya kami ucapkan terimakasih.</p>
          <p>Kami Yang Berbahagia, Keluarga Besar Kedua Mempelai</p>
          <h2 className="script closing-names">Fifi &amp; Abid</h2>
          <div className="families">
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
          </div>
        </Reveal>
        <p className="footer">© 2026 Fifi &amp; Abid</p>
      </section>
    </Invitation>
  );
}
