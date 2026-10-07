import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  CarFront,
  Compass,
  MapPin,
  Ship,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { HeroSection } from "@/components/layouts/hero-section";
import { useCopy } from "@/components/experience/use-copy";
import destinations from "@/data/destinations.json";

export function HomePage() {
  const copy = useCopy();
  const places = copy("id", "en") === "id" ? destinations.id : destinations.en;
  const featured = [1, 7, 3]
    .map((id) => places.find((p) => p.id === id))
    .filter((p) => p !== undefined);
  const services = [
    {
      icon: BedDouble,
      title: copy("Tempat menginap", "A place to stay"),
      text: copy("Hotel, homestay & penginapan", "Hotels, homestays & more"),
      to: "/layanan/penginapan",
    },
    {
      icon: CarFront,
      title: copy("Kendaraan pilihan", "Your island ride"),
      text: copy("Motor, mobil & layanan sopir", "Motorbikes, cars & drivers"),
      to: "/layanan/rental",
    },
    {
      icon: Compass,
      title: copy("Pemandu lokal", "A local perspective"),
      text: copy("Kenali Sabang bersama pemandu", "Explore with a local guide"),
      to: "/layanan/tourguide",
    },
  ];
  return (
    <div className="sk-home">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <section
          id="trip-planner"
          className="sk-planner sk-container"
          aria-label={copy(
            "Pilih layanan perjalanan",
            "Choose a travel service",
          )}
        >
          <div className="sk-planner-intro">
            <p className="sk-eyebrow">
              {copy("PERJALANANMU, PILIHANMU", "YOUR TRIP, YOUR WAY")}
            </p>
            <h2>{copy("Mulai dari mana?", "Where shall we start?")}</h2>
          </div>
          {services.map(({ icon: Icon, title, text, to }) => (
            <Link to={to} key={to} className="sk-planner-link">
              <Icon size={25} strokeWidth={1.4} />
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
              <ArrowUpRight size={19} />
            </Link>
          ))}
        </section>
        <section id="destinations" className="sk-container sk-section">
          <div className="sk-section-heading">
            <div>
              <p className="sk-eyebrow">
                {copy("KENALI PULAUNYA", "GET TO KNOW THE ISLAND")}
              </p>
              <h2>
                {copy("Ada Sabang yang", "An island worth")}
                <br />
                <em>
                  {copy(
                    "menunggu untuk kamu temukan.",
                    "taking your time for.",
                  )}
                </em>
              </h2>
            </div>
            <Link className="sk-text-link" to="/destinations">
              {copy("Semua destinasi", "All destinations")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="sk-destination-grid">
            {featured.map((place, index) => (
              <Link
                to={`/destinations/${place.id}`}
                key={place.id}
                className="sk-place"
              >
                <div className="sk-place-image">
                  <img src={place.image} alt={place.name} loading="lazy" />
                  <span className="sk-place-number">0{index + 1}</span>
                  <span className="sk-place-arrow">
                    <ArrowUpRight size={22} />
                  </span>
                </div>
                <div className="sk-place-caption">
                  <div>
                    <p className="sk-eyebrow">{place.category}</p>
                    <h3>{place.name}</h3>
                  </div>
                  <MapPin size={18} />
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section id="services" className="sk-story">
          <div className="sk-container sk-story-grid">
            <div className="sk-story-photo">
              <img
                src="/assets/destinasi/destinations/pantai-iboih/pantaiiboih-2.webp"
                alt={copy("Pemandangan pesisir Iboih", "The Iboih coastline")}
                loading="lazy"
              />
              <span>THE ISLAND LIFE, AT YOUR PACE.</span>
            </div>
            <div className="sk-story-copy">
              <p className="sk-eyebrow">
                {copy(
                  "LEBIH MUDAH BERSAMA SABANGKARSA",
                  "A LITTLE HELP FROM SABANGKARSA",
                )}
              </p>
              <h2>
                {copy("Urus rencananya.", "Sort the details.")}
                <br />
                <em>{copy("Nikmati perjalanannya.", "Enjoy the journey.")}</em>
              </h2>
              <p>
                {copy(
                  "Cari tempat beristirahat, kendaraan untuk berkeliling, dan pemandu untuk mengenal pulau ini lebih dekat. Semua bisa kamu temukan di satu tempat.",
                  "Find somewhere to rest, a ride around the island, and a guide to show you a little more. Bring your trip together in one place.",
                )}
              </p>
              <div className="sk-service-list">
                {services.map(({ title, to }, index) => (
                  <Link to={to} key={to}>
                    <span>0{index + 1}</span>
                    <strong>{title}</strong>
                    <ArrowRight size={20} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="sk-container sk-section sk-before">
          <div>
            <p className="sk-eyebrow">
              {copy("SEBELUM BERANGKAT", "BEFORE YOU GO")}
            </p>
            <h2>
              {copy("Sedikit persiapan,", "A little planning,")}
              <br />
              <em>{copy("banyak pengalaman.", "a lot to look forward to.")}</em>
            </h2>
            <p>
              {copy(
                "Pertama kali ke Sabang? Mulai dengan hal-hal yang membantu perjalananmu terasa lebih tenang.",
                "First time in Sabang? Get acquainted with the essentials before your island escape.",
              )}
            </p>
          </div>
          <div className="sk-guide-links">
            <Link to="/informations">
              <Ship />
              <div>
                <h3>
                  {copy(
                    "Menuju & berkeliling Sabang",
                    "Getting here & getting around",
                  )}
                </h3>
                <p>
                  {copy(
                    "Baca informasi transportasi dan perjalanan.",
                    "Read the transport and travel guide.",
                  )}
                </p>
              </div>
              <ArrowUpRight />
            </Link>
            <Link to="/stroll">
              <Compass />
              <div>
                <h3>
                  {copy("Singgah, berjalan, mencicipi", "Wander, pause, taste")}
                </h3>
                <p>
                  {copy(
                    "Temukan tempat singgah dan kuliner lokal.",
                    "Discover local places and island flavours.",
                  )}
                </p>
              </div>
              <ArrowUpRight />
            </Link>
            <Link to="/agenda">
              <BookOpen />
              <div>
                <h3>
                  {copy("Cerita & agenda pulau", "Island stories & events")}
                </h3>
                <p>
                  {copy(
                    "Kenali kegiatan yang mewarnai Sabang.",
                    "Get to know the life of the island.",
                  )}
                </p>
              </div>
              <ArrowUpRight />
            </Link>
          </div>
        </section>
        <section className="sk-partner">
          <div className="sk-container">
            <div>
              <p className="sk-eyebrow">
                {copy(
                  "TUMBUH BERSAMA WARGA LOKAL",
                  "GROWING WITH THE LOCAL COMMUNITY",
                )}
              </p>
              <h2>
                {copy("Punya layanan di Sabang?", "Have a service in Sabang?")}
              </h2>
              <p>
                {copy(
                  "Perkenalkan penginapan, rental, atau jasa pemandumu kepada wisatawan.",
                  "Introduce your accommodation, rentals, or guiding services to travellers.",
                )}
              </p>
            </div>
            <Link
              to={
                localStorage.getItem("user")
                  ? "/verification/seller"
                  : "/register"
              }
              className="sk-button sk-button-cream"
            >
              {copy("Kenali kemitraan", "Become a partner")}
              <ArrowUpRight size={19} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
