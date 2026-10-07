import { forwardRef, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Globe, Menu, Moon, Sun, User, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme/theme-provider";
import { API_URL } from "@/lib/api";
import "../../i18n/i18n";
import "./navbar.css";

type NavUser = { name: string; email?: string; role?: string; verificationStatus?: string };
type Panel = "services" | "explore" | "account" | "language" | "mobile" | null;

export const Navbar = forwardRef<HTMLElement, { id?: string }>(({ id = "navbar" }, ref) => {
  const { pathname, key } = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const english = i18n.language.toLowerCase().startsWith("en");
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8);
  const [panel, setPanel] = useState<Panel>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredNav, setHoveredNav] = useState<HTMLElement | null>(null);
  const [user] = useState<NavUser | null>(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  });
  const floating = pathname !== "/" || scrolled || panel === "mobile";
  const services = [
    { to: "/layanan/penginapan", label: t("nav-acco") },
    { to: "/layanan/rental", label: t("nav-rental") },
    { to: "/layanan/tourguide", label: t("nav-tg") },
  ];
  const explore = [
    { to: "/destinations", label: t("nav-dest") },
    { to: "/informations", label: t("nav-info-w") },
    { to: "/agenda", label: t("nav-agenda") },
    { to: "/stroll", label: t("nav-kuliner") },
  ];

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => { setPanel(null); }, [key]);
  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }, []);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) setPanel(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && panel) {
        setPanel(null);
        triggerRef.current?.focus();
      }
    };
    const resize = () => {
      if (window.innerWidth >= 1100 && panel === "mobile") setPanel(null);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", resize);
    };
  }, [panel]);

  const clearHoverTimer = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };
  const openHover = (next: Panel, event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover)").matches) return;
    clearHoverTimer();
    triggerRef.current = event.currentTarget.querySelector("button");
    setPanel(next);
  };
  const closeHover = (next: Panel, event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const disclosure = event.currentTarget;
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => {
      if (!disclosure.contains(document.activeElement)) setPanel(current => current === next ? null : current);
    }, 160);
  };
  const toggle = (next: Panel, button: HTMLButtonElement) => {
    clearHoverTimer();
    triggerRef.current = button;
    setPanel(current => current === next ? null : next);
  };
  const changeLanguage = (language: string) => {
    localStorage.setItem("language", language);
    // Existing pages also read localStorage at mount.
    window.location.reload();
  };
  const logout = async () => {
    try { await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" }); }
    catch (error) { console.error(error); }
    localStorage.removeItem("user");
    localStorage.removeItem("chatbot");
    navigate("/", { replace: true });
    window.location.reload();
  };
  const accountLinks = user && <>
    <p className="sk-nav-person">{user.name}<small>{user.email}</small></p>
    {user.role !== "admin" && <Link to={user.role === "seller" ? "/pemesanan" : "/pesanan"}>{t(user.role === "seller" ? "nav-order" : "nav-my-order")}</Link>}
    {user.role === "buyer" && (!user.verificationStatus || ["none", "rejected"].includes(user.verificationStatus)) && <Link to="/verification/seller">{t("nav-verif")}</Link>}
    {user.role === "seller" && <Link to="/layanan/dashboard">{t("nav-dash-sales")}</Link>}
    {user.role === "admin" && <Link to="/admin/dashboard">{t("nav-dash-adm")}</Link>}
    <button type="button" onClick={logout}>{t("nav-logout")}</button>
  </>;

  return (
    <header id={id} ref={ref} className={`sk-nav ${floating ? "sk-nav--floating" : "sk-nav--transparent"}`}>
      <div ref={shellRef} className={`sk-nav-shell${panel === "mobile" ? " sk-nav-shell--open" : ""}`} onBlur={event => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) setPanel(null);
      }}>
        <div className="sk-nav-row">
          <Link to="/" className="sk-brand" aria-label="SabangKarsa — Beranda">
            <img src="/assets/images/SabangKarsa.png" alt="" width="44" height="44" />
            <span>Sabang<span className="sk-brand-light">Karsa</span><small>SABANG, INDONESIA</small></span>
          </Link>
          <nav className="sk-nav-desktop" aria-label={english ? "Main navigation" : "Navigasi utama"} onPointerLeave={() => setHoveredNav(null)} style={{ position: "relative" }}>
            <div className="sk-nav-hover-pill" style={{
              position: "absolute",
              background: floating ? "rgba(115, 145, 132, 0.12)" : "rgba(255, 255, 255, 0.15)",
              borderRadius: "99px",
              transition: "all 300ms cubic-bezier(0.25, 1, 0.5, 1)",
              opacity: hoveredNav ? 1 : 0,
              left: hoveredNav ? hoveredNav.offsetLeft : 0,
              top: hoveredNav ? hoveredNav.offsetTop : 0,
              width: hoveredNav ? hoveredNav.offsetWidth : 0,
              height: hoveredNav ? hoveredNav.offsetHeight : 0,
              pointerEvents: "none",
              zIndex: 0
            }} />
            <Link to="/" aria-current={pathname === "/" ? "page" : undefined} onPointerEnter={e => setHoveredNav(e.currentTarget)}>{t("nav-home")}</Link>
            {([{ id: "services", label: t("nav-service"), items: services }, { id: "explore", label: english ? "Explore Sabang" : "Jelajahi Sabang", items: explore }] as const).map(group => (
              <div className="sk-nav-disclosure" key={group.id} onPointerEnter={e => { openHover(group.id, e); setHoveredNav(e.currentTarget); }} onPointerLeave={e => closeHover(group.id, e)} onBlur={e => {
                if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setPanel(null);
              }}>
                <button type="button" aria-expanded={panel === group.id} aria-controls={`sk-${group.id}`} onClick={e => toggle(group.id, e.currentTarget)}>
                  {group.label}<ChevronDown size={14} aria-hidden="true" />
                </button>
                {panel === group.id && <div className="sk-nav-dropdown" id={`sk-${group.id}`}>
                  {group.items.map(item => <Link key={item.to} to={item.to} aria-current={pathname.startsWith(item.to) ? "page" : undefined}>{item.label}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
                </div>}
              </div>
            ))}
            <Link to="/about" aria-current={pathname === "/about" ? "page" : undefined} onPointerEnter={e => setHoveredNav(e.currentTarget)}>{t("nav-about")}</Link>
          </nav>
          <div className="sk-nav-actions">
            <div className="sk-nav-disclosure sk-nav-language" onPointerEnter={e => openHover("language", e)} onPointerLeave={e => closeHover("language", e)}>
              <button type="button" aria-label={english ? "Choose language" : "Pilih bahasa"} aria-expanded={panel === "language"} aria-controls="sk-language" onClick={e => toggle("language", e.currentTarget)}><Globe size={17} aria-hidden="true" />{english ? "EN" : "ID"}<ChevronDown size={12} aria-hidden="true" /></button>
              {panel === "language" && <div className="sk-nav-dropdown sk-nav-dropdown--right" id="sk-language">
                <button type="button" lang="id" aria-pressed={!english} onClick={() => changeLanguage("id")}>Bahasa Indonesia</button>
                <button type="button" lang="en" aria-pressed={english} onClick={() => changeLanguage("en")}>English</button>
              </div>}
            </div>
            <button className="sk-nav-theme" type="button" aria-label={english ? `Use ${theme === "light" ? "dark" : "light"} theme` : `Gunakan tema ${theme === "light" ? "gelap" : "terang"}`} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}</button>
            <div className="sk-nav-account">
              {user ? <div className="sk-nav-disclosure" onPointerEnter={e => openHover("account", e)} onPointerLeave={e => closeHover("account", e)}>
                <button type="button" aria-label={english ? "Your account" : "Akun Anda"} aria-expanded={panel === "account"} aria-controls="sk-account" onClick={e => toggle("account", e.currentTarget)}><User size={18} /><ChevronDown size={14} /></button>
                {panel === "account" && <div id="sk-account" className="sk-nav-dropdown sk-nav-dropdown--right">{accountLinks}</div>}
              </div> : <Link to="/login" className="sk-nav-login">{t("nav-login")}<ArrowUpRight size={16} aria-hidden="true" /></Link>}
            </div>
            <button type="button" className="sk-nav-toggle" aria-label={panel === "mobile" ? (english ? "Close navigation" : "Tutup navigasi") : (english ? "Open navigation" : "Buka navigasi")} aria-expanded={panel === "mobile"} aria-controls="sk-mobile" onClick={e => toggle("mobile", e.currentTarget)}>{panel === "mobile" ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
        {panel === "mobile" && <nav id="sk-mobile" className="sk-nav-mobile" aria-label={english ? "Mobile navigation" : "Navigasi ponsel"}>
          <Link to="/" aria-current={pathname === "/" ? "page" : undefined}>{t("nav-home")}</Link>
          <p>{t("nav-service")}</p>
          {services.map(item => <Link key={item.to} to={item.to}>{item.label}<ArrowUpRight size={17} /></Link>)}
          <p>{english ? "Explore Sabang" : "Jelajahi Sabang"}</p>
          {explore.map(item => <Link key={item.to} to={item.to}>{item.label}</Link>)}
          <Link to="/about">{t("nav-about")}</Link>
          <div className="sk-nav-mobile-account">{user ? accountLinks : <><Link to="/login">{t("nav-login")}<ArrowUpRight size={17} /></Link><Link to="/register">{t("nav-reg")}</Link></>}</div>
        </nav>}
      </div>
    </header>
  );
});
Navbar.displayName = "Navbar";
