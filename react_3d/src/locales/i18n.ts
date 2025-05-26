import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import en from "./en.json"
import tw from "./tw.json"
import zh from "./zh.json"
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
      tw: { translation: tw },
    },
    fallbackLng: "zh", // default language
    preload: ["zh", "en", "tw"],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
