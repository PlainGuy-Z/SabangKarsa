import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DestinationsPage } from "./pages/destinations/DestinationsPage";
import { DestinationDetailPage } from "./pages/destinations/DestinationDetailPage";
import { PenginapanPage } from "./pages/layanan/penginapan/PenginapanPage";
import { InformationsPage } from "./pages/informations/InformationsPage";
import { DetailInformations } from "./pages/informations/DetailInformations";
import { AgendaPage } from "./pages/agenda/AgendaPage";
import { AgendaDetail } from "./pages/agenda/AgendaDetail";
import { StrollPage } from "./pages/stroll/StrollPage";
import { StrollDetailPage } from "./pages/stroll/StrollDetailPage";
import { AboutUs } from "./pages/aboutus/AboutUs";
import { RentalPage } from "./pages/layanan/rentaldansupir/RentalPage";
import TourGuidePage  from "./pages/layanan/tourguide/TourGuidePage";
import { VerificationFormPage } from "./pages/verification/VerificationFormPage";
import { VerificationSuccessPage } from "./pages/verification/VerificationSuccessPage";
import { GlobalChatbot } from "./components/chatbot/global-chatbot";
import { PageTransitionWrapper } from "./components/transitions/PageTransitionWrapper";
import DashboardPage from "./pages/layanan/dashboard/DashboardPage";
import AdminDashboard from "./pages/verification/AdminDashboard";
import PenginapanDetailPage from "./pages/layanan/penginapan/PenginapanDetailPage";
import DetailRentalPage from "./pages/layanan/rentaldansupir/DetailRentalPage";
import DetailTourGuidePage from "./pages/layanan/tourguide/DetailTourGuidePage";
import BookingPenginapanPage from "./pages/layanan/booking/BookingPenginapanPage";
import BookingRentalPage from "./pages/layanan/booking/BoookingRentalPage";
import BookingTourguidePage from "./pages/layanan/booking/BookingTourguidePage";
import PemesananPage from "./pages/layanan/pemesanan/PemesananPage";
import PesananPage from "./pages/layanan/pemesanan/PesananPage";
import { NotFound } from "./pages/NotFound";
import axios, { AxiosError } from "axios";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect } from "react";

interface TokenRes {
  active: boolean;
  token: string;
  data: {
    id: string;
    role: string;
    iat: number;
    exp: number;
  }
}

function App() {
  if (localStorage.getItem("language") === null) localStorage.setItem("language", "ID");
  if (localStorage.getItem("chatbot") === null) localStorage.setItem("chatbot", JSON.stringify({
    user: [], 
    bot: []
  }));
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const checkToken = async (token: string) => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL;
          const response = await axios.get<TokenRes>(`${apiUrl}/token`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (!response.data.active) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("chatbot");
            window.location.href = "/";
          }
        }
        catch (error) {
          const err = error as AxiosError;
          console.error(err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("chatbot");
          window.location.href = "/";
        }
      }
      checkToken(token);
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <PageTransitionWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:id" element={<DestinationDetailPage />} />
            <Route path="/layanan/penginapan" element={<PenginapanPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/informations" element={<InformationsPage />} />
            <Route path="/informations/:id" element={<DetailInformations />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/agenda/:id" element={<AgendaDetail />} />
            <Route path="/stroll" element={<StrollPage />} />
            <Route path="/stroll/:id" element={<StrollDetailPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/layanan/rental" element={<RentalPage />} />
            <Route path="/layanan/tourguide" element={<TourGuidePage />} />
            <Route path="/verification/seller" element={<VerificationFormPage />} />
            <Route path="/verification-success" element={<VerificationSuccessPage />} />
            <Route path="/layanan/dashboard" element={<DashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/layanan/penginapan/:id" element={<PenginapanDetailPage />} />
            <Route path="/layanan/rental/:id" element={<DetailRentalPage />} />
            <Route path="/layanan/tour-guide/:id" element={<DetailTourGuidePage />} />
          
            <Route path="/penginapan/:id/booking" element={<BookingPenginapanPage />} />
            <Route path="/rental/:id/booking" element={<BookingRentalPage />} />
            <Route path="/tourguide/:id/booking" element={<BookingTourguidePage />} />
            <Route path="/pemesanan" element={<PemesananPage />} />
            <Route path="/pesanan" element={<PesananPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <GlobalChatbot />
        </PageTransitionWrapper>
      </Router>
      <SpeedInsights />
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
