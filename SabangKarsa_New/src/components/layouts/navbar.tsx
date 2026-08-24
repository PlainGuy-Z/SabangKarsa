import { useState, useEffect, forwardRef } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import {
  User,
  LogOut,
  ChevronDown,
  Home,
  MapPinIcon,
  Car,
  UserCheck,
  Calendar,
  Utensils,
  Info,
  Menu,
  X,
  ShoppingBag,
  Globe,
  Shield,
  Settings,
} from "lucide-react";
import logoNav from "/assets/images/SabangKarsa.png";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export const Navbar = forwardRef<HTMLElement, { id?: string }>((props, ref) => {
  const { id = "navbar" } = props;
  const [user, setUser] = useState<any>(null);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isDestinationsDropdownOpen, setIsDestinationsDropdownOpen] = useState(false);
  const { theme } = useTheme();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const language = localStorage.getItem("language");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Set active section based on current route
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveSection("home");
    } else if (
      location.pathname === "/destinations" ||
      location.pathname.startsWith("/destinations/")
    ) {
      setActiveSection("destinations");
    } else if (location.pathname.startsWith("/layanan")) {
      setActiveSection("services");
    } else if (location.pathname === "/agenda") {
      setActiveSection("agenda");
    } else if (location.pathname === "/stroll") {
      setActiveSection("stroll");
    } else if (location.pathname === "/about") {
      setActiveSection("about");
    } else if (
      location.pathname === "/login" ||
      location.pathname === "/register"
    ) {
      setActiveSection("auth");
    } else {
      setActiveSection("other");
    }
  }, [location.pathname]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error(t("nav-err-msg"), error);
      }
    }
  }, [t]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isServicesDropdownOpen &&
        !(event.target as Element).closest(".services-dropdown-container")
      ) {
        setIsServicesDropdownOpen(false);
      }
      if (
        isDestinationsDropdownOpen &&
        !(event.target as Element).closest(".destinations-dropdown-container")
      ) {
        setIsDestinationsDropdownOpen(false);
      }
      if (
        isProfileDropdownOpen &&
        !(event.target as Element).closest(".profile-dropdown-container")
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        isLanguageDropdownOpen &&
        !(event.target as Element).closest(".language-dropdown-container")
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    isServicesDropdownOpen,
    isDestinationsDropdownOpen,
    isProfileDropdownOpen,
    isLanguageDropdownOpen,
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("chatbot");
    setUser(null);
    navigate("/", { replace: true });
    window.location.reload();
  };

  const handleNavigation = (itemId: string) => {
    // Direct navigation for specific routes
    if (itemId === "agenda") {
      navigate("/agenda");
    } else if (itemId === "stroll") {
      navigate("/stroll");
    } else if (itemId === "about") {
      navigate("/about");
    } else if (itemId === "home") {
      navigate("/");
    } else {
      // Scroll to section for other items (if on homepage)
      if (location.pathname !== "/") {
        navigate("/#" + itemId);
      } else {
        const element = document.getElementById(itemId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setActiveSection(itemId);
        }
      }
    }
  };

  const getDropdownState = (itemId: string) => {
    if (itemId === "services") return isServicesDropdownOpen;
    if (itemId === "destinations") return isDestinationsDropdownOpen;
    return false;
  };

  const isItemActive = (itemId: string) => {
    if (itemId === "destinations") {
      return (
        location.pathname === "/destinations" ||
        location.pathname.startsWith("/destinations/") ||
        activeSection === "destinations"
      );
    }
    if (itemId === "home") {
      return (
        location.pathname === "/" &&
        (activeSection === "home" || activeSection === "")
      );
    }
    return activeSection === itemId;
  };

  const toggleDropdown = (itemId: string) => {
    if (itemId === "services") {
      setIsServicesDropdownOpen(!isServicesDropdownOpen);
      setIsDestinationsDropdownOpen(false);
    } else if (itemId === "destinations") {
      setIsDestinationsDropdownOpen(!isDestinationsDropdownOpen);
      setIsServicesDropdownOpen(false);
    }
  };

  const closeDropdown = (itemId: string) => {
    if (itemId === "services") setIsServicesDropdownOpen(false);
    if (itemId === "destinations") setIsDestinationsDropdownOpen(false);
  };

  const navItems = [
    { id: "home", label: t("nav-home"), icon: Home },
    {
      id: "destinations",
      label: t("nav-dest"),
      icon: MapPinIcon,
      hasDropdown: true,
      dropdownItems: [
        { id: "info-wisata", label: t("nav-info-w"), icon: Info },
        { id: "tujuan-destinasi", label: t("nav-tujuan-d"), icon: MapPinIcon },
      ],
    },
    {
      id: "services",
      label: t("nav-service"),
      icon: Car,
      hasDropdown: true,
      dropdownItems: [
        { id: "penginapan", label: t("nav-acco"), icon: Home },
        { id: "driver-rental", label: t("nav-rental"), icon: Car },
        { id: "tour-guide", label: t("nav-tg"), icon: UserCheck },
      ],
    },
    { id: "agenda", label: t("nav-agenda"), icon: Calendar },
    { id: "stroll", label: t("nav-kuliner"), icon: Utensils },
    { id: "about", label: t("nav-about"), icon: Info },
  ];

  const handleChangeLanguage = (lang: string) => {
    localStorage.setItem("language", lang.toLowerCase());
    setIsLanguageDropdownOpen(false);
    window.location.reload();
  }

  return (
    <header
      id={id}
      ref={ref}
      className="fixed top-0 left-0 xl:left-25 right-0 xl:right-25 z-50"
    >
      <div className="mx-auto max-w-8xl px-2 sm:px-4 py-1 sm:py-2">
        <div className={`navbar-glass flex items-center justify-between rounded-full px-4 sm:px-6 xl:px-3 2xl:px-6 py-2 sm:py-3 shadow-lg border ${theme === "light" ? "border-gray-200" : "border-gray-700/50"} min-h-[50px] sm:min-h-[55px]`}>
          <div
            className="flex items-center gap-2 sm:gap-3 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logoNav}
              alt="SabangKarsa Logo"
              className="w-12 h-12 sm:w-18 sm:h-18 object-contain transition-all duration-300 group-hover:scale-105"
              loading="eager"
            />
          </div>

          {/* Navigation Menu - Hidden on mobile */}
          <nav className="hidden xl:flex items-center gap-2">
            {navItems.map((item) => (
              <div key={item.id} className="relative">
                {item.hasDropdown ? (
                  <div className={`relative ${item.id}-dropdown-container`}>
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className={`nav-item flex items-center gap-1.5 text-sm ${
                        isItemActive(item.id) ? "active" : ""
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 ${
                          getDropdownState(item.id) ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Modern Dropdown Menu */}
                    <div
                      className={`dropdown-menu absolute top-full left-0 mt-2 w-56 transition-all duration-300 z-50 ${
                        getDropdownState(item.id)
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }`}
                    >
                      {item.dropdownItems?.map((dropdownItem, index) => (
                        <button
                          key={dropdownItem.id}
                          onClick={() => {
                            if (dropdownItem.id === "tujuan-destinasi") {
                              navigate("/destinations");
                            } else if (dropdownItem.id === "info-wisata") {
                              navigate("/informations");
                            } else if (dropdownItem.id === "penginapan") {
                              navigate("/layanan/penginapan");
                            } else if (dropdownItem.id === "driver-rental") {
                              navigate("/layanan/rental");
                            } else if (dropdownItem.id === "tour-guide") {
                              navigate("/layanan/tourguide");
                            } else {
                              handleNavigation(dropdownItem.id);
                            }
                            closeDropdown(item.id);
                          }}
                          className="dropdown-item flex items-center gap-2 w-full text-left text-sm"
                          style={{
                            transitionDelay: `${index * 50}ms`,
                          }}
                        >
                          <dropdownItem.icon className="w-4 h-4" />
                          <span>{dropdownItem.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`nav-item flex items-center gap-1.5 text-sm ${
                      isItemActive(item.id) ? "active" : ""
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 xl:gap-2 2xl:gap-3">
            {/* Language Toggle */}
            <div className="relative language-dropdown-container">
              <button
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-emerald-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-lg transition-all duration-300"
              >
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  {language?.toUpperCase()}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ${
                    isLanguageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Language Dropdown */}
              <div
                className={`dropdown-menu overflow-hidden absolute top-full right-0 mt-2 w-32 transition-all duration-300 z-50 ${
                  isLanguageDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="py-1">
                  <button
                    onClick={() => handleChangeLanguage("ID")}
                    className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm transition-colors duration-200 ${
                      language?.toUpperCase() === "ID"
                        ? `${theme === "light" ? "bg-emerald-50 text-emerald-700" : "bg-emerald-900/30 text-emerald-700"} cursor-none pointer-events-none`
                        : `${theme === "light" ? "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600" : "text-gray-300 hover:bg-emerald-900/20 hover:text-emerald-600"}`
                    }`}
                  >
                    <span>🇮🇩</span>
                    <span>{t("nav-lang-id")}</span>
                  </button>
                  <button
                    onClick={() => handleChangeLanguage("EN")}
                    className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm transition-colors duration-200 ${
                      language?.toUpperCase() === "EN"
                        ? `${theme === "light" ? "bg-emerald-50 text-emerald-700" : "bg-emerald-900/30 text-emerald-700"} cursor-none pointer-events-none`
                        : `${theme === "light" ? "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600" : "text-gray-300 hover:bg-emerald-900/20 hover:text-emerald-600"}`
                    }`}
                  >
                    <span>🇺🇸</span>
                    <span>{t("nav-lang-en")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden px-1.5 py-1.5 text-emerald-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-lg transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {user ? (
              <>
                <div className="hidden sm:block">
                  <ThemeToggle />
                </div>
                <div className="relative profile-dropdown-container">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all duration-300"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-gray-400 transition-transform duration-300 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  <div
                    className={`dropdown-menu absolute top-full right-0 mt-2 w-56 transition-all duration-300 z-50 ${
                      isProfileDropdownOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                {user.role || t("nav-user")}
                              </p>
                            
                            </div>
                          </div>
                        </div>
                      </div>
                      {user.role !== "admin" && (
                        <button
                          onClick={() => {
                            navigate(user.role === "seller" ? "/pemesanan" : "/pesanan");
                            setIsProfileDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-purple-900/20 hover:text-emerald-600 dark:hover:text-purple-400 transition-colors duration-200"
                        >
                        <ShoppingBag className="w-4 h-4" />
                        <span className="font-medium">
                          {user.role === "seller" ? t("nav-order") : t("nav-my-order")}
                        </span>
                        </button>
                      )}

                      {/* Only show verification option for buyers who haven't applied or were rejected */}
                      {user.role === "buyer" &&
                        (!user.verificationStatus ||
                          user.verificationStatus === "none" ||
                          user.verificationStatus === "rejected") && (
                          <button
                            onClick={() => {
                              navigate("/verification/seller");
                              setIsProfileDropdownOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                          >
                            <Shield className="w-4 h-4" />
                            <span className="font-medium">
                              {t("nav-verif")}
                            </span>
                          </button>
                        )}
                        {user.role === "seller" && (
                          <button
                            onClick={() => {
                              navigate("/layanan/dashboard");
                              setIsProfileDropdownOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span className="font-medium">{t("nav-dash-sales")}</span>
                          </button>
                        )}
                        {user.role === "admin" && (
                          <button
                            onClick={() => {
                              navigate("/admin/dashboard");
                              setIsProfileDropdownOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-purple-900/20 hover:text-emerald-600 dark:hover:text-purple-400 transition-colors duration-200"
                          >
                            <Settings className="w-4 h-4" />
                            <span className="font-medium">{t("nav-dash-adm")}</span>
                          </button>
                        )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">{t("nav-logout")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="hidden sm:block">
                  <ThemeToggle />
                </div>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  size="sm"

                  className="[border-color:oklch(0.4771_0.0777_205.67)] text-emerald-600 hover:bg-emerald-50 hover:border-emerald-700 transition-all duration-300 hidden md:flex px-3 py-1.5 text-xs sm:text-sm"
>
                  {t("nav-login")}
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  size="sm"
                  className="bg-emerald-500 text-white hover:bg-emerald-500 transition-all duration-300 transform hover:scale-105 px-3 py-1.5 text-xs sm:text-sm"
                >
                  {t("nav-reg")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`xl:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-4">
          <div className="navbar-glass rounded-3xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg border-t border-gray-200 dark:border-gray-700/50">
            {/* Mobile Auth Buttons & Theme Toggle */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t("nav-theme")}
                </span>
              </div>
              {!user && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-300 px-3 py-1.5 text-xs"
                  >
                    {t("nav-login")}
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/register");
                      setIsMobileMenuOpen(false);
                    }}
                    size="sm"
                    className="bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 px-3 py-1.5 text-xs"
                  >
                    {t("nav-reg")}
                  </Button>
                </div>
              )}
            </div>
            <nav className="space-y-1">
              {navItems.map((item, index) => (
                <div
                  key={item.id}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className={`flex items-center justify-between w-full px-3 py-2.5 text-left hover:text-emerald-700 dark:hover:text-blue-400 rounded-lg transition-all duration-300 ${
                          isItemActive(item.id)
                            ? "text-emerald-600 dark:text-blue-400"
                            : "text-emerald-600/80 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium text-sm">
                            {item.label}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            getDropdownState(item.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`ml-4 mt-1 space-y-1 transition-all duration-300 ${
                          getDropdownState(item.id)
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        } overflow-hidden`}
                      >
                        {item.dropdownItems?.map((dropdownItem, subIndex) => (
                          <button
                            key={dropdownItem.id}
                            onClick={() => {
                              if (dropdownItem.id === "tujuan-destinasi") {
                                navigate("/destinations");
                              } else if (dropdownItem.id === "info-wisata") {
                                navigate("/informations");
                              } else if (dropdownItem.id === "penginapan") {
                                navigate("/layanan/penginapan");
                              } else if (dropdownItem.id === "driver-rental") {
                                navigate("/layanan/rental");
                              } else if (dropdownItem.id === "tour-guide") {
                                navigate("/layanan/tourguide");
                              } else {
                                handleNavigation(dropdownItem.id);
                              }
                              closeDropdown(item.id);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2 text-left text-emerald-600/70 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
                            style={{
                              transitionDelay: `${subIndex * 30}ms`,
                            }}
                          >
                            <dropdownItem.icon className="w-4 h-4" />
                            <span className="font-medium text-sm">
                              {dropdownItem.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleNavigation(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 text-left hover:text-emerald-700 dark:hover:text-blue-400 rounded-lg transition-all duration-300 ${
                        isItemActive(item.id)
                          ? "text-emerald-600 dark:text-blue-400"
                          : "text-emerald-600/80 dark:text-gray-300"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
});
