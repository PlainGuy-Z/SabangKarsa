import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin, Pause, Play, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layouts/navbar";
import destinations from "@/data/destinations.json";
import "./home.css";

const copy = {
  id: {
    skip: "Langsung ke konten", eyebrow: "PULAU WEH · ACEH · INDONESIA",
    title: "Ada cerita baru", titleEnd: "di ujung barat.",
    intro: "Laut yang jernih. Jalan yang mengundang. Waktu untuk menikmati Sabang dengan caramu sendiri.",
    start: "Rencanakan perjalanan", discover: "Kenali Sabang", scroll: "Perjalanan dimulai di sini",
    pause: "Jeda video", play: "Putar video", serviceLabel: "KEPERLUAN PERJALANANMU",
    serviceTitle: "Satu tujuan. Banyak cara menikmati.",
    serviceIntro: "Temukan tempat menginap, kendaraan untuk berkeliling, dan teman menjelajah. Mulai dari yang kamu butuhkan.",
    services: [
      { name: "Penginapan", note: "TEMPAT UNTUK PULANG", description: "Cari tempat beristirahat yang cocok dengan rencana perjalananmu.", action: "Temukan penginapan", image: "/assets/destinasi/pantaiiboih.webp", alt: "Pesisir Iboih dengan bangunan di tepi laut", caption: "Suasana pesisir Iboih" },
      { name: "Rental kendaraan", note: "BEBAS MENENTUKAN ARAH", description: "Jelajahi sudut pulau dengan pilihan motor, mobil, dan layanan supir.", action: "Lihat pilihan rental", image: "/assets/images/motor1.webp", alt: "Motor skuter putih untuk ilustrasi layanan rental", caption: "Motor & mobil" },
      { name: "Tour guide", note: "LEBIH DEKAT DENGAN SABANG", description: "Temukan pemandu untuk menemani perjalanan dan mengenal destinasi pilihanmu.", action: "Temukan tour guide", image: "/assets/destinasi/pulaurubiah.webp", alt: "Perahu di perairan Pulau Rubiah", caption: "Perairan Pulau Rubiah" },
    ],
    placeLabel: "KENALI PULAUNYA", placeTitle: "Temukan destinasi pilihanmu",
    placeIntro: "Kenali pesona Sabang, dari pantai dan perairannya hingga danau di tengah pulau. Lihat informasi destinasi untuk merencanakan kunjunganmu.",
    allPlaces: "Lihat semua destinasi", price: "Kisaran biaya masuk", detail: "Lihat detail", rating: "Rating",
    planLabel: "DARI RENCANA JADI PERJALANAN", planTitle: "Sabang menunggu.\nMulai dari sini.",
    steps: [
      { title: "Temukan tujuanmu", text: "Kenali destinasi dan baca informasi wisata sebelum menyusun rute.", link: "Baca informasi wisata", to: "/informations" },
      { title: "Lengkapi perjalananmu", text: "Pilih penginapan, kendaraan, atau tour guide sesuai kebutuhan.", link: "Pilih layanan", to: "#services" },
      { title: "Nikmati waktu di pulau", text: "Cari inspirasi kuliner dan tempat singgah untuk melengkapi harimu.", link: "Jelajahi kuliner", to: "/stroll" },
    ],
    footerLine: "Perjalanan ke Sabang, dimulai dengan satu langkah.", about: "Tentang kami", information: "Informasi wisata", instagram: "Temui kami di Instagram", footerSmall: "Dari ujung barat, untuk perjalananmu.",
  },
  en: {
    skip: "Skip to content", eyebrow: "WEH ISLAND · ACEH · INDONESIA",
    title: "A new story awaits", titleEnd: "at the western edge.",
    intro: "Clear seas. Inviting roads. Time to discover Sabang in your own way.",
    start: "Plan your journey", discover: "Discover Sabang", scroll: "Your journey starts here",
    pause: "Pause video", play: "Play video", serviceLabel: "YOUR TRAVEL ESSENTIALS",
    serviceTitle: "One island. Your way to explore.",
    serviceIntro: "Find a place to stay, a ride around the island, and a guide to explore with. Start with what you need.",
    services: [
      { name: "Accommodation", note: "A PLACE TO COME BACK TO", description: "Find a place to rest that fits the journey you have in mind.", action: "Find a place to stay", image: "/assets/destinasi/pantaiiboih.webp", alt: "Buildings along the coast of Iboih", caption: "Along the Iboih coast" },
      { name: "Vehicle rental", note: "FIND YOUR OWN DIRECTION", description: "Explore the island with a choice of scooters, cars, and driver services.", action: "Explore rentals", image: "/assets/images/motor1.webp", alt: "White scooter illustrating vehicle rental", caption: "Scooters & cars" },
      { name: "Tour guides", note: "GET TO KNOW SABANG", description: "Find a guide to accompany your journey and explore your chosen destinations.", action: "Find a tour guide", image: "/assets/destinasi/pulaurubiah.webp", alt: "Boats in the waters around Rubiah Island", caption: "Around Rubiah Island" },
    ],
    placeLabel: "MEET THE ISLAND", placeTitle: "Find your next destination",
    placeIntro: "Get to know Sabang, from its beaches and blue waters to the lake at the heart of the island. Explore destination information to plan your visit.",
    allPlaces: "See all destinations", price: "Entrance fee range", detail: "See details", rating: "Rating",
    planLabel: "FROM AN IDEA TO A JOURNEY", planTitle: "Sabang is waiting.\nStart here.",
    steps: [
      { title: "Find your destination", text: "Discover destinations and travel information before planning your route.", link: "Read travel information", to: "/informations" },
      { title: "Make it your journey", text: "Choose accommodation, a vehicle, or a guide to suit your plans.", link: "Explore services", to: "#services" },
      { title: "Enjoy island time", text: "Find local food and places to stop that make your day complete.", link: "Explore local food", to: "/stroll" },
    ],
    footerLine: "Your Sabang journey begins with a single step.", about: "About us", information: "Travel information", instagram: "Find us on Instagram", footerSmall: "From the western edge, for your journey.",
  },
};
const serviceRoutes = ["/layanan/penginapan", "/layanan/rental", "/layanan/tourguide"];

export function HomePage() {
  const { i18n } = useTranslation();
  const english = i18n.language.toLowerCase().startsWith("en");
  const c = copy[english ? "en" : "id"];
  const { hash } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const destinationData = destinations[english ? "en" : "id"];
  const featuredDestinations = destinationData.slice(0, 4);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducedMotion(media.matches);
      if (media.matches) videoRef.current?.pause();
      else videoRef.current?.play().catch(() => setPlaying(false));
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "instant" });
  }, [hash]);
  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  return (
    <div className="sk-home" lang={english ? "en" : "id"}>
      <a className="sk-skip" href="#main-content">{c.skip}</a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section className="sk-hero" id="home" aria-labelledby="sk-hero-title">
          <video ref={videoRef} className="sk-hero-video" autoPlay={!reducedMotion} loop muted playsInline preload="metadata" poster="/assets/images/sabanglogin.webp" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
            <source src="/video/videobg.webm" type="video/webm" />
            <source src="/video/videobg.mp4" type="video/mp4" />
          </video>
          <div className="sk-hero-shade" />
          <div className="sk-hero-content sk-container">
            <p className="sk-eyebrow"><span className="sk-small-line" />{c.eyebrow}</p>
            <h1 id="sk-hero-title">{c.title}<br /><em>{c.titleEnd}</em></h1>
            <p className="sk-hero-intro">{c.intro}</p>
            <div className="sk-hero-links">
              <a className="sk-button sk-button--white" href="#services">{c.start}<ArrowUpRight size={19} aria-hidden="true" /></a>
              <a className="sk-hero-discover" href="#destinations">{c.discover}<ArrowRight size={18} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="sk-hero-bottom sk-container">
            <a href="#services" className="sk-scroll"><ArrowDown size={18} aria-hidden="true" />{c.scroll}</a>
            <div className="sk-hero-location"><MapPin size={14} aria-hidden="true" />Sabang, Pulau Weh</div>
            <button type="button" onClick={toggleVideo} className="sk-video-toggle" aria-label={playing ? c.pause : c.play}>{playing ? <Pause size={15} /> : <Play size={15} />}<span>{playing ? c.pause : c.play}</span></button>
          </div>
        </section>

        <section id="services" className="sk-services sk-container" aria-labelledby="sk-services-title">
          <div className="sk-section-heading">
            <div><p className="sk-eyebrow">01 / {c.serviceLabel}</p><h2 id="sk-services-title">{c.serviceTitle}</h2></div>
            <p className="sk-section-intro">{c.serviceIntro}</p>
          </div>
          <div className="sk-service-grid">
            {c.services.map((service, index) => <Link className={`sk-service-card sk-service-card--${index}`} to={serviceRoutes[index]} key={service.name}>
              <div className="sk-service-image"><img src={service.image} alt={service.alt} loading="lazy" width="640" height="480" /><span className="sk-image-caption">{service.caption}</span><span className="sk-card-arrow"><ArrowUpRight size={22} aria-hidden="true" /></span></div>
              <div className="sk-service-body"><p className="sk-card-note">{service.note}</p><h3>{service.name}</h3><p>{service.description}</p><span className="sk-service-action">{service.action}<ArrowRight size={17} aria-hidden="true" /></span></div>
            </Link>)}
          </div>
        </section>

        <section id="destinations" className="sk-destinations sk-container" aria-labelledby="sk-places-title">
          <div className="sk-section-heading">
            <div><p className="sk-eyebrow">02 / {c.placeLabel}</p><h2 id="sk-places-title">{c.placeTitle}</h2></div>
            <p className="sk-section-intro">{c.placeIntro}</p>
          </div>
          <div className="sk-destination-grid">
            {featuredDestinations.map(destination => <Link key={destination.id} to={`/destinations/${destination.id}`} className="sk-destination-card">
              <div className="sk-destination-image">
                <img src={destination.image} alt={destination.name} loading="lazy" width="640" height="420" />
                <span className="sk-destination-rating" aria-label={`${c.rating} ${destination.rating}`}><Star size={17} aria-hidden="true" />{destination.rating}</span>
                <span className="sk-destination-category">{destination.category}</span>
              </div>
              <div className="sk-destination-body">
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
                <div className="sk-destination-price"><span>{c.price}</span><strong>{destination.price}</strong></div>
                <span className="sk-destination-detail">{c.detail}<ArrowRight size={17} aria-hidden="true" /></span>
              </div>
            </Link>)}
          </div>
          <div className="sk-destination-more"><Link to="/destinations" className="sk-button sk-button--outline">{c.allPlaces}<ArrowRight size={19} aria-hidden="true" /></Link></div>
        </section>

        <section className="sk-plan sk-container" aria-labelledby="sk-plan-title">
          <div className="sk-plan-heading"><p className="sk-eyebrow">03 / {c.planLabel}</p><h2 id="sk-plan-title">{c.planTitle}</h2></div>
          <div className="sk-plan-steps">{c.steps.map((step, index) => <article key={step.title}><span className="sk-step-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p>{step.to.startsWith("#") ? <a href={step.to} className="sk-text-link">{step.link}<ArrowUpRight size={17} /></a> : <Link to={step.to} className="sk-text-link">{step.link}<ArrowUpRight size={17} /></Link>}</div></article>)}</div>
        </section>
      </main>
      <footer className="sk-home-footer">
        <div className="sk-container"><div className="sk-footer-top"><div><Link to="/" className="sk-footer-brand">SabangKarsa</Link><p>{c.footerLine}</p></div><nav aria-label={english ? "Footer navigation" : "Navigasi penutup"}><Link to="/about">{c.about}</Link><Link to="/informations">{c.information}</Link><a href="https://www.instagram.com/sabangkarsa" target="_blank" rel="noreferrer">{c.instagram}<ArrowUpRight size={15} /></a></nav></div><div className="sk-footer-bottom"><span>© {new Date().getFullYear()} SabangKarsa</span><span>Sabang, Aceh, Indonesia</span><span>{c.footerSmall}</span></div></div>
      </footer>
    </div>
  );
}
