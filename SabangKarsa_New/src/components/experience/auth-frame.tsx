import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import { useCopy } from "./use-copy";
export function AuthFrame({ children }: { children: ReactNode }) {
  const copy = useCopy();
  return (
    <main id="main-content" className="sk-auth-layout">
      <aside className="sk-auth-photo">
        <Link className="sk-brand" to="/">
          <img
            src="/assets/images/SabangKarsa.png"
            alt=""
            width="43"
            height="43"
          />
          <span>SabangKarsa</span>
        </Link>
        <div>
          <p className="sk-eyebrow">PULAU WEH · ACEH · INDONESIA</p>
          <h1>
            {copy("Perjalanan baik", "Good journeys")}
            <br />
            <em>{copy("dimulai dari sini.", "start here.")}</em>
          </h1>
          <p>
            {copy(
              "Temukan penginapan, kendaraan, dan pemandu lokal. Simpan semua rencana Sabangmu dalam satu tempat.",
              "Find stays, transport, and local guides. Keep your Sabang plans together in one place.",
            )}
          </p>
        </div>
        <span className="sk-eyebrow">YOUR ISLAND COMPANION</span>
      </aside>
      <section className="sk-auth-form">
        <div>
          <Link className="sk-auth-back" to="/">
            <ArrowLeft size={13} className="inline mr-2" />
            {copy("Kembali ke SabangKarsa", "Back to SabangKarsa")}
          </Link>
          {children}
        </div>
      </section>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </main>
  );
}
