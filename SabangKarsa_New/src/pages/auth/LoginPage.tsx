import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthFrame } from "@/components/experience/auth-frame";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import type { UserData } from "@/types/userData";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n";
import { API_URL } from "@/lib/api";

export function LoginPage() {
  const navigate = useNavigate();
  const userData: UserData = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (userData.id) navigate("/", { replace: true });
  }, [userData.id, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

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
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok && result.user) {
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
    <AuthFrame>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t("login-header")}
        </h2>
        <p className="text-muted-foreground">{t("login-p")}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            {t("login-email")}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              autoComplete="email"
              id="email"
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            {t("login-pass")}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t("login-pass-ph")}
              className="w-full pl-10 pr-10 py-3 bg-input/50 backdrop-blur-sm border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring focus:bg-input transition-all duration-200"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
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
          <div
            role="alert"
            className="text-destructive text-red-500 text-sm bg-destructive/10 border border-destructive/20 rounded-md p-3"
          >
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
    </AuthFrame>
  );
}
