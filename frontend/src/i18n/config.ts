import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import ENtranslation from "./en/translation.json";
import FRtranslation from "./fr/translation.json";

i18next.use(initReactI18next).init({
  debug: false,
  fallbackLng: "en",
  resources: {
    en: {
      translation: ENtranslation,
    },
    fr: {
      translation: FRtranslation,
    },
  },
  // if you see an error like: "Argument of type 'DefaultTFuncReturn'
  // is not assignable to parameter of type xyz"
  // set returnNull to false (and also in the i18next.d.ts options)
  // returnNull: false,
});

export default i18next;
