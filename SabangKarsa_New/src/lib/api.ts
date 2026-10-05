/**
 * Centralized API configuration.
 * Memastikan base URL selalu memiliki prefix '/api' secara konsisten.
 * 
 * Contoh:
 * - https://sabangkarsa-production-3793.up.railway.app -> https://sabangkarsa-production-3793.up.railway.app/api
 * - https://sabangkarsa-production-3793.up.railway.app/api -> https://sabangkarsa-production-3793.up.railway.app/api
 * - http://localhost:3001 -> http://localhost:3001/api
 */
const getBaseApiUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").trim().replace(/\/+$/, "");
  return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

export const API_URL = getBaseApiUrl();
export default API_URL;
