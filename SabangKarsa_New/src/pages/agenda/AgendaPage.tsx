
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import data from "../../data/events.json";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

interface Event {
  id: number;
  name: string;
  description: string;
  image: string;
  date: string;
  category: string;
    location: string;
}


export function AgendaPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const language = localStorage.getItem("language");
  const eventsData: Event[] = language?.toLowerCase() === "id" ? data.id : data.en;
  const { t } = useTranslation();

  useEffect(() => {
    setEvents(eventsData);
  }, [eventsData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language?.toLowerCase() === "id" ? "id-ID" : "en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar id="navbar" />

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/assets/destinasi/pantaiiboih.webp"
            alt="Informasi Sabang"
            className="w-full h-full object-cover scale-110"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t("agendapg-h-1")} <span className="text-emerald-800">   {t("agendapg-h-2")}</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
                {t("agendapg-p")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t("agendapg-list")}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event.id}
                className="bg-card rounded-xl shadow-lg border border-border card-border-hover overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: event.id * 0.1 }}
              >
                <div className="relative h-48">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/destinasi/pantaiiboih.webp";
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </div>
                </div>
                <div className="p-6">
                  <a href={`/agenda/${event.id}`} className="font-bold text-xl mb-2 hover:text-emerald-600 transition-colors no-underline cursor-pointer duration-200">
                    {event.name}
                  </a>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <Link to={`/agenda/${event.id}`}>
                    <Button className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white">
                      {t("agendapg-btn")}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
