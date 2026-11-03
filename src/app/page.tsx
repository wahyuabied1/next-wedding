import Image from "next/image";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import Gift from "@/components/Gift";
import Closing from "@/components/Closing";
import Invitation from "@/components/Invitation";
import Opening from "@/components/Opening";
import { Divider, Flora, PhotoOval } from "@/components/Ornaments";
import Reveal from "@/components/Reveal";
import Rsvp from "@/components/Rsvp";
import { calendarUrl, countdownTarget, couple, events, galleryExclude, galleryFirst, gallerySwaps, venue } from "@/lib/config";
import { getAllPhotos, getPhoto } from "@/lib/photos";

function dateParts(iso: string) {
  const d = new Date(iso);
  const f = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", ...options }).format(d);
  return { month: f({ month: "long" }).toUpperCase(), day: f({ day: "2-digit" }), year: f({ year: "numeric" }) };
}

function Person({ person, reverse, id }: { person: typeof couple.bride; reverse?: boolean; id: string }) {
  const photo = getPhoto(person.photo);
  const fullName = person.degree ? `${person.name}, ${person.degree}` : person.name;
  return (
    <Reveal className={`couple${reverse ? " reverse" : ""}`}>
      <PhotoOval
        id={id}
        className="couple-photo"
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={fullName}
        sizes="(max-width: 500px) 45vw, 220px"
      />
      <div className="couple-text">
        <h3 className="script name">{fullName}</h3>
        {person.parents.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </Reveal>
  );
}

const MapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V9h14v11zm-9.2-3.2l-2-2 1.4-1.4.6.6 3-3 1.4 1.4-4.4 4.4z" />
  </svg>
);

export default function Home() {
  const together = getPhoto(couple.together.photo);
  const galleryPhotos = getAllPhotos(galleryExclude, galleryFirst, gallerySwaps);
  const date = dateParts(events[0].start);
  const [akad, resepsi] = events;

  return (
    <Invitation>
      {/* Pembuka: ayat pada oval renda di atas amplop dan tirai */}
      <Opening />

      {/* Kedua mempelai: beludru marun */}
      <section id="mempelai" className="section maroon">
        <Reveal>
          <h2 className="script heading">Kedua Mempelai</h2>
          <p className="lead">Kami Nantikan Kehadiran Para Keluarga Dan Sahabat, Untuk Menjadi Saksi Di Hari Yang Bahagia.</p>
        </Reveal>

        <Reveal className="arch">
          <Image
            src={together.src}
            alt="Fifi & Abid"
            width={together.width}
            height={together.height}
            sizes="(max-width: 500px) 80vw, 400px"
            priority
          />
        </Reveal>

        <Reveal>
          <p className="lead doa">
            Maha Suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah dan
            Ridhoilah Pernikahan Kami.
          </p>
        </Reveal>

        <Person person={couple.bride} id="bride" />
        <Reveal>
          <p className="amp script" aria-hidden="true">
            &amp;
          </p>
        </Reveal>
        <Person person={couple.groom} id="groom" reverse />
      </section>

      {/* Acara: kertas hijau */}
      <section id="acara" className="section green">
        <Flora variant="hang" className="flora-acara" flip />
        <Reveal>
          <h2 className="script heading big">Save the Date</h2>
          <Countdown target={countdownTarget} />

          <div className="date-row">
            <div className="date-box">
              <span className="script">{akad.title}</span>
              <small>{akad.timeLabel}</small>
            </div>
            <div className="date-center">
              <span>{date.month}</span>
              <strong>{date.day}</strong>
              <span>{date.year}</span>
            </div>
            <div className="date-box">
              <span className="script">{resepsi.title}</span>
              <small>{resepsi.timeLabel}</small>
            </div>
          </div>
        </Reveal>

        {events.map((event, i) => (
          <Reveal key={event.key} className="event">
            {i > 0 && <Divider className="event-divider" />}
            <h3 className="script event-title">{event.title}</h3>
            <p className="event-date">{event.dateLabel}</p>
            <p className="event-date">{event.timeLabel}</p>
            <p className="event-venue">{venue.name}</p>
            <p className="event-address">{venue.address}</p>
            <div className="event-actions">
              <a className="btn" href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
                <MapIcon />
                Open Map
              </a>
              <a className="btn ghost" href={calendarUrl(event)} target="_blank" rel="noopener noreferrer">
                <CalendarIcon />
                Save the Date
              </a>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Galeri: marun */}
      <section id="galeri" className="section maroon">
        <Reveal>
          <h2 className="script heading">Our Moments</h2>
          <p className="lead quote">&quot; A happy marriage is a long conversation which always seems too short&quot;.</p>
        </Reveal>
        <Gallery photos={galleryPhotos} />
      </section>

      {/* Hadiah: hijau */}
      <section id="hadiah" className="section green">
        <Flora variant="mound-small" className="flora-gift" />
        <Reveal>
          <h2 className="script heading">Wedding Gift</h2>
          <p className="lead">
            Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda
            kasih Anda, Anda dapat memberi kado secara cashless.
          </p>
        </Reveal>
        <Gift />
      </section>

      {/* Penutup: oval marun di atas amplop, lalu keluarga besar */}
      <Closing />

      {/* Konfirmasi kehadiran: paling bawah */}
      <section id="rsvp" className="section maroon rsvp-section">
        <Reveal>
          <h2 className="script heading">
            Rsvp
            <br />
            Doa &amp; Ucapan
          </h2>
        </Reveal>
        <Rsvp />
        <p className="footer">© 2026 Fifi &amp; Abid</p>
      </section>
    </Invitation>
  );
}
