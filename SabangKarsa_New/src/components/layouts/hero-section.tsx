import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, MapPin, Pause, Play } from "lucide-react";
import { useCopy } from "@/components/experience/use-copy";

export function HeroSection() {
  const copy = useCopy();
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (preference.matches) video.current?.pause();
      else video.current?.play().catch(() => setPlaying(false));
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  function toggleVideo() {
    if (playing) video.current?.pause();
    else video.current?.play().catch(() => setPlaying(false));
  }
  return (
    <section
      id="home"
      className="sk-hero"
      aria-label={copy("Selamat datang di Sabang", "Welcome to Sabang")}
    >
      <video
        ref={video}
        loop
        muted
        playsInline
        preload="metadata"
        poster="/assets/images/sabanglogin.webp"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-hidden="true"
      >
        <source src="/video/videobg.webm" type="video/webm" />
        <source src="/video/videobg.mp4" type="video/mp4" />
      </video>
      <div className="sk-hero-shade" />
      <div className="sk-container sk-hero-content">
        <p className="sk-eyebrow">
          <span className="sk-line" /> PULAU WEH · ACEH · INDONESIA
        </p>
        <h1>
          {copy("Jauh dari biasa.", "Somewhere slower.")}
          <br />
          <em>{copy("Dekat dengan Sabang.", "Somewhere Sabang.")}</em>
        </h1>
        <p className="sk-hero-description">
          {copy(
            "Pagi di tepi laut, cerita dari warga lokal, dan perjalanan dengan caramu sendiri. Mulai dari sini.",
            "Sea-air mornings, stories from the locals, and an island to explore at your own pace. Start here.",
          )}
        </p>
        <Link to="/destinations" className="sk-button sk-button-cream">
          {copy("Temukan sisi Sabangmu", "Find your side of Sabang")}
          <ArrowUpRight size={19} />
        </Link>
        <div className="sk-hero-bottom">
          <span>
            <MapPin size={15} />
            {copy("Satu pulau. Banyak cerita.", "One island. Many stories.")}
          </span>
          <a href="#trip-planner">
            {copy("Rencanakan perjalanan", "Plan your visit")}
            <ArrowDown size={15} />
          </a>
          <button
            onClick={toggleVideo}
            aria-label={
              playing
                ? copy("Jeda video latar", "Pause background video")
                : copy("Putar video latar", "Play background video")
            }
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            <span>
              {playing ? copy("Jeda", "Pause") : copy("Putar", "Play")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
