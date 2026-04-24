import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./locales/fr.json";
import en from "./locales/en.json";
import ln from "./locales/ln.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ln: { translation: ln }
    },
    lng: "fr", // On force le français par défaut au départ pour éviter les bugs de détection
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;