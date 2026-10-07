import { forwardRef, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun,
  ArrowUpRight,
  LogOut,
  UserRound,
} from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { useCopy } from "@/components/experience/use-copy";
import { API_URL } from "@/lib/api";

type Account = { name?: string; role?: string };
export const Navbar = forwardRef<HTMLElement, { id?: string }>(function Navbar(
  { id = "navbar" },
  ref,
) {
  const copy = useCopy();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menus = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [user, setUser] = useState<Account | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  useEffect(() => {
    setOpen(false);
    menus.current?.querySelectorAll("details").forEach((d) => (d.open = false));
  }, [location.pathname]);
  useEffect(() => {
    const dismiss = (e: MouseEvent) => {
      if (menus.current && !menus.current.contains(e.target as Node)) {
        menus.current
          .querySelectorAll("details")
          .forEach((d) => (d.open = false));
        setOpen(false);
      }
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const activeMenu =
          menus.current?.querySelector<HTMLDetailsElement>("details[open]");
        if (activeMenu) {
          activeMenu.open = false;
          activeMenu.querySelector("summary")?.focus();
        } else {
          setOpen(false);
          menuButton.current?.focus();
        }
      }
    };
    document.addEventListener("mousedown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  async function logout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* clear the local session even when offline */
    }
    localStorage.removeItem("user");
    localStorage.removeItem("chatbot");
    setUser(null);
    navigate("/");
    window.location.reload();
  }
  const links = [
    ["/layanan/penginapan", copy("Menginap", "Stays")],
    ["/layanan/rental", copy("Sewa kendaraan", "Vehicle rental")],
    ["/layanan/tourguide", copy("Pemandu lokal", "Local guides")],
  ];
  return (
    <header ref={ref} id={id} className="sk-nav">
      <a className="sk-skip" href="#main-content">
        {copy("Lewati navigasi", "Skip navigation")}
      </a>
      <div className="sk-nav-inner" ref={menus}>
        <Link to="/" className="sk-brand" aria-label="SabangKarsa — Home">
          <img
            src="/assets/images/SabangKarsa.png"
            alt=""
            width="43"
            height="43"
          />
          <span>
            Sabang<span>Karsa</span>
            <small>YOUR ISLAND COMPANION</small>
          </span>
        </Link>
        <nav
          id="primary-navigation"
          aria-label={copy("Navigasi utama", "Main navigation")}
          className={`sk-nav-links ${open ? "is-open" : ""}`}
        >
          {links.map(([to, label]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
          <details className="sk-disclosure">
            <summary>
              {copy("Jelajahi Sabang", "Explore Sabang")}
              <ChevronDown size={14} />
            </summary>
            <div className="sk-menu">
              <Link to="/destinations">
                {copy("Destinasi", "Destinations")}
              </Link>
              <Link to="/stroll">
                {copy("Jalan-jalan & kuliner", "Stroll & culinary")}
              </Link>
              <Link to="/agenda">{copy("Agenda lokal", "Local events")}</Link>
              <Link to="/informations">
                {copy("Panduan perjalanan", "Travel guide")}
              </Link>
              <Link to="/about">
                {copy("Tentang SabangKarsa", "About SabangKarsa")}
              </Link>
            </div>
          </details>
          <button
            className="sk-mobile-theme"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            {theme === "light"
              ? copy("Mode gelap", "Dark mode")
              : copy("Mode terang", "Light mode")}
          </button>
        </nav>
        <div className="sk-nav-actions">
          <button
            className="sk-language"
            aria-label={copy("Switch to English", "Ganti ke Bahasa Indonesia")}
            onClick={() => {
              localStorage.setItem("language", copy("en", "id"));
              window.location.reload();
            }}
          >
            {copy("ID", "EN")}
            <ChevronDown size={12} />
          </button>
          <button
            className="sk-icon-button sk-theme"
            aria-label={
              theme === "light"
                ? copy("Gunakan mode gelap", "Use dark mode")
                : copy("Gunakan mode terang", "Use light mode")
            }
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {user ? (
            <details className="sk-disclosure sk-account">
              <summary>
                <UserRound size={17} />
                <span>
                  {user.name?.split(" ")[0] || copy("Akun", "Account")}
                </span>
                <ChevronDown size={13} />
              </summary>
              <div className="sk-menu">
                {user.role !== "admin" && (
                  <Link to={user.role === "seller" ? "/pemesanan" : "/pesanan"}>
                    {copy("Pesanan saya", "My bookings")}
                  </Link>
                )}
                {user.role === "buyer" && (
                  <Link to="/verification/seller">
                    {copy("Jadi mitra", "Become a partner")}
                  </Link>
                )}
                {user.role === "seller" && (
                  <Link to="/layanan/dashboard">
                    {copy("Kelola layanan", "Manage services")}
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin/dashboard">
                    {copy("Dashboard admin", "Admin dashboard")}
                  </Link>
                )}
                <button onClick={logout}>
                  <LogOut size={15} />
                  {copy("Keluar", "Log out")}
                </button>
              </div>
            </details>
          ) : (
            <Link className="sk-nav-login" to="/login">
              {copy("Masuk", "Log in")}
              <ArrowUpRight size={15} />
            </Link>
          )}
          <button
            ref={menuButton}
            className="sk-icon-button sk-menu-toggle"
            aria-label={copy("Menu navigasi", "Navigation menu")}
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
});
