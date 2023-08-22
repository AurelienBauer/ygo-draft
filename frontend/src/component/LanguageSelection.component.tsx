import React, {
  ReactElement, useCallback, useEffect, useState,
} from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { FR, GB } from "country-flag-icons/react/3x2";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { AvailableLangs, GameContext, GameContextType } from "./Game/GameContext";

interface Lang {
  key: AvailableLangs;
  countryName: string;
  icon: ReactElement,
}

const langs: Lang[] = [{
  key: "en",
  countryName: "English",
  icon: <GB title="United Kingdom" className="country-flags" />,
}, {
  key: "fr",
  countryName: "Français",
  icon: <FR title="France" className="country-flags" />,
}];

function LanguageSelection() {
  const { lang, setLang } = React.useContext(GameContext) as GameContextType;
  const [cookie, setCookie] = useCookies(["lang"]);
  const { i18n } = useTranslation();

  const [selectedLang, setSelectedLang] = useState<Lang | undefined>();

  const changeLanguage = useCallback((lng: AvailableLangs) => {
    if (lng) {
      i18n.changeLanguage(lng, () => {
        setLang(lng);
        setCookie("lang", lng, { maxAge: 60 * 60 * 24 * 30, sameSite: "strict" });
      });
    }
  }, [i18n, setCookie, setLang]);

  useEffect(() => {
    const currentLang = langs.filter((l) => l.key === lang);
    if (currentLang.length) {
      setSelectedLang(currentLang[0]);
    }
  }, [lang]);

  useEffect(() => {
    if (cookie) {
      changeLanguage(cookie.lang);
    }
  }, [changeLanguage, cookie]);

  return (
    <div className="btn-group">
      <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        {selectedLang?.icon}
      </button>
      <ul className="dropdown-menu dropdown-menu-dark">
        {selectedLang && (
        <li>
          <button
            key={selectedLang.key}
            className="dropdown-item"
            onClick={() => changeLanguage(selectedLang.key)}
            type="button"
          >
            {selectedLang.icon}
            {selectedLang.countryName}

          </button>
        </li>
        )}
        <li><hr className="dropdown-divider" /></li>
        {langs.map((l) => (
          l.key !== selectedLang?.key && (
          <li key={l.key}>
            <button
              key={l.key}
              className="dropdown-item"
              onClick={() => changeLanguage(l.key)}
              type="button"
            >
              {l.icon}
              {l.countryName}
            </button>
          </li>
          )
        ))}
      </ul>
    </div>
  );
}

export default LanguageSelection;
