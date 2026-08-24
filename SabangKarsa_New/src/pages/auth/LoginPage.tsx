import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import { Eye, EyeOff, Mail, Lock} from "lucide-react";
import type { UserData } from '@/types/userData';
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export function LoginPage() {
  const navigate = useNavigate();
  const userData: UserData = JSON.parse(localStorage.getItem("user") || "{}");
  
  if (userData.id) {
    navigate(-1);
  }

  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    setIsLoaded(true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/", { replace: true });
        window.location.reload();
      } else {
        setError(result.error || t("login-error"));
      }
    } catch (err) {
      setError(t("login-err-msg"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        {/* Floating Elements */}
        <div className="absolute inset-0">
          {/* Animated Circles */}
          <div
            className="absolute w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"
            style={{
              top: "10%",
              left: "10%",
              transform: `translate(${mousePosition.x * 0.1}px, ${
                mousePosition.y * 0.1
              }px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
          <div
            className="absolute w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"
            style={{
              top: "60%",
              right: "10%",
              transform: `translate(${mousePosition.x * -0.1}px, ${
                mousePosition.y * -0.1
              }px)`,
              transition: "transform 0.3s ease-out",
              animationDelay: "1s",
            }}
          />
          <div
            className="absolute w-48 h-48 bg-accent/20 rounded-full blur-2xl animate-bounce"
            style={{
              top: "30%",
              left: "80%",
              transform: `translate(${mousePosition.x * 0.05}px, ${
                mousePosition.y * 0.05
              }px)`,
              transition: "transform 0.3s ease-out",
              animationDelay: "2s",
            }}
          />

          {/* Floating Icons */}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:flex-1 flex-col justify-center items-center px-12 py-16">
          <div
            className={`transform transition-all duration-1000 text-center ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
          >
            {/* Logo */}
            <div className="mb-2">
              <img 
                src="/assets/images/SabangKarsa.png" 
                alt="SabangKarsa Logo" 
                className="w-48 h-48 mx-auto mb-2 drop-shadow-lg"
              />
            </div>
            <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
              {t("login-welcome")}
              <br />
              <span className="gradient-text-alt">SabangKarsa</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              {t("login-line")}
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-16 lg:px-12">
          <div className="w-full max-w-md">
            <div
              className={`bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 transform transition-all duration-1000 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {t("login-header")}
                </h2>
                <p className="text-muted-foreground">
                  {t("login-p")}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    {t("login-email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t("login-email-ph")}
                      className="w-full pl-10 pr-3 py-3 bg-input/50 backdrop-blur-sm border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring focus:bg-input transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    {t("login-pass")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t("login-pass-ph")}
                      className="w-full pl-10 pr-10 py-3 bg-input/50 backdrop-blur-sm border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring focus:bg-input transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-destructive text-red-500 text-sm bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? t("login-loading") : t("login-button")}
                </Button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {t("login-reg-text")}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="ml-1 text-secondary hover:text-secondary/80 transition-colors font-medium"
                  >
                    {t("login-reg-hl")}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
