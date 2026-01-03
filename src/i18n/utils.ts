import { en } from "./en";
import { config } from "../consts";

const ui = {
  en,
};

export function useTranslations(lang: string) {
  const safeLang: keyof typeof ui =
    lang in ui ? (lang as keyof typeof ui) : "en";
  return function t(key: string) {
    return ui[safeLang][key] || ui["en"][key];
  };
}

export const t = useTranslations(config.lang);
