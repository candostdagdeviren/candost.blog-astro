import {en} from './en'
import {config} from "../consts";

const ui = {
  en,
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: string) {
    return ui[lang][key] || ui[config.lang][key];
  }
}

export const t = useTranslations(config.lang)

