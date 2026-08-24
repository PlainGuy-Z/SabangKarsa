import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layouts/footer";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layouts/navbar";
import "../i18n/i18n"

export function NotFound ({
    title,
    message,
    buttonText,
    buttonRoute,
}: {
    title?: string;
    message?: string;
    buttonText?: string;
    buttonRoute?: string;
}) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="relative h-[48vh] min-h-[400px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                <img
                    src="/assets/destinasi/pantaiiboih.webp"
                    alt="Destinasi Sabang"
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
                        {title ? title : t("nf-page")} <span className="text-emerald-800">{t("nf-not-found")}</span>
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        {message ? message : t("nf-massage")}
                    </motion.p>
                    <Button
                      size="lg"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(buttonRoute ? buttonRoute : `/`);
                      }}
                    >
                      {buttonText ? buttonText : t("nf-button")}
                    </Button>
                </motion.div>
                </div>
            </section>
            <Footer />
        </div>
    );
}