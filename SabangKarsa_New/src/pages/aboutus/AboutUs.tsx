import { PageIntro } from "@/components/experience/page-intro";
import { useCopy } from "@/components/experience/use-copy";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone } from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import data from "../../data/about.json";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n";

interface TeamMember {
  id: number;
  group: "core" | "research";
  name: string;
  role: string;
  image: string;
  bio: string;
}

export function AboutUs() {
  const { t, i18n } = useTranslation();
  const copy = useCopy();

  const lang = (
    i18n.language ||
    localStorage.getItem("language") ||
    "en"
  ).toLowerCase();
  const team = (lang.startsWith("id") ? data.id : data.en) as TeamMember[];

  const groups = [
    { key: "core", title: t("about-team-core") },
    { key: "research", title: t("about-team-research") },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <Navbar id="navbar" />

      <PageIntro title={copy("Dari Sabang, untuk perjalananmu.", "From Sabang, for your journey.")} description={copy("Mendekatkan wisatawan dengan tempat, layanan, dan cerita di Sabang.", "Connecting travellers with the places, services, and stories of Sabang.")} image="/assets/images/sabanglogin.webp" />

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
      <section className="py-20 px-4 bg-muted/40">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
              SabangKarsa
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              {t("about-team")}
            </h2>

            <p className="text-muted-foreground mt-4">{t("about-team-desc")}</p>
          </motion.div>

          {groups.map(({ key, title }) => (
            <div key={key} className="mb-14 last:mb-0">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center lg:text-left">
                {title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {team
                  .filter((member) => member.group === key)
                  .map((member, index) => (
                    <motion.div
                      key={member.id}
                      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                        <img
                          src={member.image}
                          alt={member.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/assets/images/SabangKarsa.png";
                          }}
                        />
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-foreground">
                          {member.name}
                        </h3>

                        <p className="text-sm font-medium text-emerald-600 mt-1">
                          {member.role}
                        </p>

                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
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
                    <p className="text-muted-foreground">+62 812-3456-7890</p>
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
                  onClick={() =>
                    window.open("mailto:sabangkarsa@gmail.com", "_blank")
                  }
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
