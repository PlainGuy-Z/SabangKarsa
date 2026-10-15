// Production requests go through the website's /api proxy so session cookies
// stay on the same origin, even if an old VITE_API_URL is configured in Vercel.
const getBaseApiUrl = (): string => {
  if (import.meta.env.PROD) return "/api";
  const envUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").trim().replace(/\/+$/, "");
  return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

export const API_URL = getBaseApiUrl();
export default API_URL;
