import { useTranslation } from "react-i18next";
import "@/i18n/i18n";

/** The legacy content also reads localStorage, so language changes reload the app. */
export function useCopy() {
  const { i18n } = useTranslation();
  const english = i18n.language.toLowerCase().startsWith("en");
  return (id: string, en: string) => (english ? en : id);
}
