import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Clock,
  Tag,
  Share2,
  Heart,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import data from "../../data/informations.json";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"
import DOMPurify from 'dompurify';

interface Information {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  views: number;
  publishDate: string;
  tags: string[];
  author?: string;
  authorAvatar?: string;
}

interface InformationData {
  informationData: Information[];
  categories: string[];
}


export function DetailInformations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const language = localStorage.getItem("language");
  const { informationData }: InformationData = language?.toLowerCase() === "id" ? data.id : data.en;
  const [information, setInformation] = useState<Information | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      const foundInformation = informationData.find(
        (info) => info.id === parseInt(id)
      );
      setInformation(foundInformation || null);
      if (foundInformation) {
        // Simulate random likes
        setLikes(Math.floor(Math.random() * 100) + 20);
      }
    }
  }, [id, informationData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language?.toLowerCase() === "id" ? "id-ID" : "en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: information?.title,
        text: information?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert(t("di-copied"));
    }
  };

  if (!information) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t("di-not-found")}
          </h2>
          <Button onClick={() => navigate("/informations")}>
            {t("di-back-btn-1")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar id="navbar" />

      {/* Hero Section */}
      <section id="main-content" tabIndex={-1} className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={information.image}
            alt={information.title}
            className="w-full h-full object-cover scale-110 transition-transform duration-700"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/informations")}
          className="absolute top-24 left-4 md:left-8 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        {/* Content */}
        <div className="relative z-10 h-full flex items-end justify-center px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            {/* Category Badge */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {information.category}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {information.title}
            </motion.h1>

            {/* Meta Info */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(information.publishDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{information.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{information.views.toLocaleString(language?.toLowerCase() || "id")} {t("di-viewer")}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <motion.article
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-1">
                  {information.author}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("di-publisher")} {formatDate(information.publishDate)}
                </p>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(information.content) }}
                style={{
                  lineHeight: "1.8",
                }}
              />

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    {t("di-tags")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {information.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share & Like */}
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isLiked
                          ? "bg-red-50 text-red-600 dark:bg-red-900/20"
                          : "bg-muted text-muted-foreground hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                      />
                      <span>{likes}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>{t("di-share")}</span>
                    </button>
                  </div>
                  
                </div>
            </motion.article>
            {/* Sidebar */}
            <motion.aside
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="sticky top-24 space-y-6">
                {/* Reading Progress */}
                <div className="detail-box rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {t("di-info")}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("di-category")}</span>
                      <span className="font-medium text-right">
                        {information.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("di-time")}</span>
                      <span className="font-medium text-right">
                        {information.readTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("di-viewer-info")}</span>
                      <span className="font-medium text-right">
                        {information.views.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("di-writer")}</span>
                      <span className="font-medium text-right">{information.author || "Admin"}</span>
                    </div>
                  </div>
                </div>

                {/* Related Articles */}
                <div className="detail-box rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {t("di-related")}
                  </h3>
                  <div className="space-y-4">
                    {(() => {
                      const relatedData = informationData
                        .filter(
                          (info) =>
                            info.id !== information.id &&
                            info.category === information.category
                        )
                        .slice(0, 3);

                      if (relatedData.length > 0) {
                        return relatedData.map((relatedInfo) => (
                          <div
                            key={relatedInfo.id}
                            className="group cursor-pointer"
                            onClick={() => navigate(`/informations/${relatedInfo.id}`)}
                          >
                            <div className="flex gap-3">
                              <img
                                src={relatedInfo.image}
                                alt={relatedInfo.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-foreground group-hover:text-emerald-600 transition-colors line-clamp-2">
                                  {relatedInfo.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {relatedInfo.readTime}
                                </p>
                              </div>
                            </div>
                          </div>
                        ));
                      }

                      return (
                        <p className="text-sm text-muted-foreground">
                          {t("di-related-nf")}
                        </p>
                      );
                    })()}
                  </div>
                </div>

                {/* Back to Blog */}
                <Button
                  onClick={() => navigate("/informations")}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {t("di-back-btn-2")}
                </Button>
              </div>
              
            </motion.aside>
          </div>
        </div>
      </section>
     

      <Footer />
    </div>
  );
}