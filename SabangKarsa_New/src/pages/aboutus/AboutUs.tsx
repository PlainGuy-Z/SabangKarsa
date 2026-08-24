import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Users } from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import data from "../../data/about.json";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}

const teamData: TeamMember[] = localStorage.getItem("language")?.toLowerCase() === "id" ? data.id : data.en;

export function AboutUs() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    setTeam(teamData);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar id="navbar" />
    {/* Hero Section */}
    <section className="relative [background:linear-gradient(to_right,oklch(0.4771_0.0777_205.67/0.8),oklch(0.5809_0.0963_194.83/0.8))] text-white overflow-hidden">
        <div className="absolute inset-0 -z-10">
            <img 
                src="/assets/destinasi/pantaiiboih.webp" 
                alt="Sabang" 
                    loading="lazy"
                className="w-full h-full object-cover opacity-40"
            />
        </div>
        <div className="container mx-auto max-w-7xl px-4 py-32 md:py-36 flex flex-col items-center">
            <motion.h1 
                className="text-4xl md:text-6xl font-bold text-center mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {t("about-header-1")}
            </motion.h1>
            <motion.p 
                className="text-lg md:text-xl text-center max-w-3xl mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {t("about-tagline")}
            </motion.p>
            <motion.div 
                className="flex flex-wrap gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Users className="w-5 h-5" />
                    <span>{t("about-point-1")}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <MapPin className="w-5 h-5" />
                    <span>{t("about-point-2")}</span>
                </div>
            </motion.div>
        </div>
    </section>

      {/* Mission & Vision Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t("about-header-2")}
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="detail-box rounded-2xl p-6 md:p-8 shadow-lg bg-card">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                {t("about-mission")}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                {t("about-mission-p")}
              </p>
            </div>
            <div className="detail-box rounded-2xl p-6 md:p-8 shadow-lg bg-card">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                {t("about-vision")}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                {t("about-vision-p")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4 bg-muted/50 ">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t("about-team")}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-0 ">
            {team.map((member) => (
              <motion.div
                key={member.id}
                className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 [border-color:oklch(0.4771_0.0777_205.67)] hover:[border-color:oklch(0.5809_0.0963_194.83)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: member.id * 0.1 }}
              >
                <div className="relative h-85 bg-gradient-to-b from-[oklch(0.4771_0.0777_205.67)] to-[oklch(0.8588_0.0371_172.63)]">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="eager"
                    className="w-full h-full object-cover object-[0px_-20px]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/destinasi/pantaiiboih.webp";
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t("about-contact")}
          </motion.h2>
          <motion.div
            className="detail-box rounded-2xl p-6 md:p-8 shadow-lg bg-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  {t("about-contact-1")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    <p className="text-muted-foreground">
                      {t("about-contact-1-1")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    <p className="text-muted-foreground">
                      sabangkarsa@gmail.com
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    <p className="text-muted-foreground">
                      +62 812-3456-7890
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  {t("about-contact-2")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("about-contact-2-1")}
                </p>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={() => window.open("mailto:sabangkarsa@gmail.com", "_blank")}
                >
                  {t("about-send-btn")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
