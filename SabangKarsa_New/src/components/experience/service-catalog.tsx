import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ArrowUpRight,
  MapPin,
  Search,
  Compass,
  WifiOff,
  ImageOff,
} from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { API_URL } from "@/lib/api";
import { PageIntro } from "./page-intro";
import { useCopy } from "./use-copy";

type Kind = "stay" | "rental" | "guide";
type Listing = {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  category: string;
  price: number | null;
  features: string[];
  path: string;
};
function normalize(record: Record<string, unknown>, kind: Kind): Listing {
  const str = (key: string) =>
    typeof record[key] === "string" ? (record[key] as string) : "";
  const price = record[kind === "stay" ? "hargaPerMalam" : "harga"];
  const id = str("_id");
  return {
    id,
    name: str(kind === "stay" ? "nama" : "name"),
    image: str(kind === "guide" ? "foto" : "gambar"),
    description: str(kind === "guide" ? "kataKata" : "deskripsi"),
    location: str(
      kind === "stay"
        ? "lokasi"
        : kind === "guide"
          ? "wilayah"
          : "namaPenyedia",
    ),
    category: str(kind === "stay" ? "tipePeningapan" : "type"),
    price:
      typeof price === "number" && Number.isFinite(price) && price >= 0
        ? price
        : null,
    features: Array.isArray(record.fasilitas)
      ? record.fasilitas
          .filter((f): f is string => typeof f === "string")
          .slice(0, 3)
      : [],
    path: `/layanan/${kind === "stay" ? "penginapan" : kind === "guide" ? "tour-guide" : "rental"}/${id}`,
  };
}
function ListingImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
  ) : (
    <div
      className="h-full flex items-center justify-center"
      role="img"
      aria-label={alt}
    >
      <ImageOff size={32} className="text-muted-foreground" />
    </div>
  );
}
export function ServiceCatalog({ kind }: { kind: Kind }) {
  const copy = useCopy();
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name");
  const config = {
    stay: {
      endpoint: "penginapan",
      title: copy(
        "Temukan tempat untuk pulang sejenak.",
        "Find your home on the island.",
      ),
      label: copy("Penginapan", "Accommodation"),
      description: copy(
        "Pilih penginapan sesuai rencana dan caramu menikmati Sabang. Lihat lokasi, fasilitas, dan harga sebelum memesan.",
        "Find a stay that suits your plans. Explore locations, amenities, and rates before you book.",
      ),
      image: "/assets/destinasi/destinations/pantai-iboih/pantaiiboih-2.webp",
    },
    rental: {
      endpoint: "rental",
      title: copy(
        "Keliling pulau, dengan caramu.",
        "The island, at your own pace.",
      ),
      label: copy("Sewa kendaraan", "Vehicle rental"),
      description: copy(
        "Motor untuk perjalanan santai atau mobil untuk bersama-sama. Temukan kendaraan dan layanan sopir untuk rencanamu.",
        "A motorbike for a quiet ride or a car for the whole group. Find the vehicle or driver for your trip.",
      ),
      image: "/assets/images/sectionhero.webp",
    },
    guide: {
      endpoint: "tourguides",
      title: copy(
        "Kenali Sabang lewat cerita lokal.",
        "See the island through local eyes.",
      ),
      label: copy("Pemandu lokal", "Local guides"),
      description: copy(
        "Temui pemandu, lihat wilayah layanannya, dan pilih teman perjalanan untuk mengenal Sabang lebih dekat.",
        "Meet the guides, explore their service areas, and find a companion to help you get to know Sabang.",
      ),
      image: "/assets/destinasi/destinations/gua-sarang/wisataguasarang-1.webp",
    },
  }[kind];
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    // A failed or stalled service is shown explicitly, never as an empty catalogue.
    const timeout = window.setTimeout(() => {
      if (active) {
        setError(true);
        setLoading(false);
        controller.abort();
      }
    }, 15000);
    setLoading(true);
    setError(false);
    fetch(`${API_URL}/${config.endpoint}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Request failed");
        const data: unknown = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid catalogue");
        return data;
      })
      .then((data) => {
        if (active)
          setItems(
            data
              .filter(
                (row): row is Record<string, unknown> =>
                  row !== null && typeof row === "object",
              )
              .map((row) => normalize(row, kind))
              .filter((row) => row.id && row.name),
          );
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        clearTimeout(timeout);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [kind, config.endpoint, attempt]);
  const categories = [
    ...new Set(
      items.map((item) => item.category.toLowerCase()).filter(Boolean),
    ),
  ];
  const filtered = items
    .filter(
      (item) =>
        `${item.name} ${item.description} ${item.location}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (!category || item.category.toLowerCase() === category),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : a.price === null
          ? 1
          : b.price === null
            ? -1
            : sort === "low"
              ? a.price - b.price
              : b.price - a.price,
    );
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <PageIntro {...config} eyebrow={config.label} />
        <section className="sk-container sk-catalog" aria-label={config.label}>
          <nav
            className="sk-catalog-tabs"
            aria-label={copy("Kategori layanan", "Service categories")}
          >
            <NavLink to="/layanan/penginapan">
              {copy("Menginap", "Stays")}
            </NavLink>
            <NavLink to="/layanan/rental">
              {copy("Sewa kendaraan", "Vehicle rental")}
            </NavLink>
            <NavLink to="/layanan/tourguide">
              {copy("Pemandu lokal", "Local guides")}
            </NavLink>
          </nav>
          <div className="sk-filters">
            <label className="sk-search">
              <Search size={19} />
              <span className="sr-only">
                {copy("Cari layanan", "Search services")}
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy(
                  "Cari nama atau lokasi…",
                  "Search by name or location…",
                )}
              />
            </label>
            <label className="sk-sort">
              {copy("Urutkan", "Sort by")}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="name">{copy("Nama A–Z", "Name A–Z")}</option>
                <option value="low">
                  {copy("Harga terendah", "Lowest price")}
                </option>
                <option value="high">
                  {copy("Harga tertinggi", "Highest price")}
                </option>
              </select>
            </label>
          </div>
          {categories.length > 0 && (
            <div
              className="sk-filter-chips"
              aria-label={copy("Filter jenis", "Filter by type")}
            >
              <button aria-pressed={!category} onClick={() => setCategory("")}>
                {copy("Semua", "All")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  aria-pressed={category === cat}
                  onClick={() => setCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          {loading ? (
            <div
              role="status"
              aria-label={copy("Memuat layanan", "Loading services")}
              className="sk-catalog-grid"
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="sk-skeleton" />
              ))}
            </div>
          ) : error ? (
            <div role="alert" className="sk-status">
              <WifiOff />
              <h2>
                {copy(
                  "Layanan belum dapat dimuat.",
                  "We couldn’t load the services.",
                )}
              </h2>
              <p>
                {copy(
                  "Periksa koneksi internet atau coba kembali sebentar lagi.",
                  "Check your connection or try again in a moment.",
                )}
              </p>
              <button
                className="sk-button"
                onClick={() => setAttempt(attempt + 1)}
              >
                {copy("Coba lagi", "Try again")}
              </button>
            </div>
          ) : (
            <>
              <p className="sk-results-count" role="status">
                {filtered.length}{" "}
                {copy("pilihan untuk perjalananmu", "options for your trip")}
              </p>
              {filtered.length === 0 ? (
                <div className="sk-status">
                  <Compass />
                  <h2>
                    {copy(
                      "Belum ada pilihan yang sesuai.",
                      "No matching services yet.",
                    )}
                  </h2>
                  <p>
                    {copy(
                      "Coba kata kunci lain atau lihat kembali semua pilihan layanan.",
                      "Try a different search or explore all available services.",
                    )}
                  </p>
                  {(query || category) && (
                    <button
                      className="sk-button"
                      onClick={() => {
                        setQuery("");
                        setCategory("");
                      }}
                    >
                      {copy("Hapus filter", "Clear filters")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="sk-catalog-grid">
                  {filtered.map((item) => (
                    <article className="sk-listing" key={item.id}>
                      <div className="sk-listing-image">
                        <ListingImage src={item.image} alt={item.name} />
                        {item.category && (
                          <span className="capitalize">{item.category}</span>
                        )}
                      </div>
                      <div className="sk-listing-content">
                        <div className="sk-listing-location">
                          <MapPin size={12} />
                          {item.location || "Sabang"}
                        </div>
                        <h2>
                          <Link to={item.path}>{item.name}</Link>
                        </h2>
                        <p>{item.description}</p>
                        {item.features.length > 0 && (
                          <div className="sk-listing-features">
                            {item.features.map((feature) => (
                              <span key={feature}>{feature}</span>
                            ))}
                          </div>
                        )}
                        <div className="sk-listing-price">
                          <div>
                            <strong>
                              {item.price === null
                                ? copy("Lihat harga", "View price")
                                : new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0,
                                  }).format(item.price)}
                            </strong>
                            <small>
                              {kind === "stay"
                                ? copy("per malam", "per night")
                                : copy("per hari", "per day")}
                            </small>
                          </div>
                          <Link to={item.path}>
                            {copy("Lihat detail", "View details")}
                            <ArrowUpRight size={15} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
