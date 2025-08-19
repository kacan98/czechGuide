import en from "@/i18n/en.json";
import sv from "@/i18n/sv.json";

// Default values for internationalization
const SITE_LANG = "en";
const CURRENCY = "USD";
const LOCALE = "en-US";

const translations: Record<string, Locale> = {
  en,
  sv,
};

export function useTranslations(lang: string) {
  return function t(key: string) {
    if (!translations[lang]) return key;
    
    // Handle nested keys like "hero.title"
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((current, prop) => current?.[prop], obj);
    };
    
    const value = getNestedValue(translations[lang], key) || 
                  getNestedValue(translations[SITE_LANG], key) || 
                  key;
    
    return value;
  };
}

export function translateUrl(
  url: URL,
  locales: string[],
  removeCurrentLanguage?: boolean,
) {
  const [, lang] = url.pathname.split("/");
  let baseUrl = url.pathname;
  let currentLang = SITE_LANG;

  if (locales.includes(lang)) {
    baseUrl = url.pathname.replace(`/${lang}`, "");
    currentLang = lang;
  }

  let urls = locales.map((locale) => {
    return {
      locale,
      url: locale === SITE_LANG ? baseUrl : `/${locale}${baseUrl}`,
    };
  });

  if (removeCurrentLanguage)
    urls = urls.filter((u) => u.locale !== currentLang);

  return urls;
}

export function getLangFromUrl(url: URL) {
  const ui = Object.keys(translations);
  const [, lang] = url.pathname.split("/");
  if (ui.includes(lang)) return lang as string;
  return SITE_LANG;
}

function convertToLocaleTime(timeString: string, lang: string): string {
  // Split the time string into hours and minutes
  const [hours, minutes] = timeString.split(':').map(Number);

  // Create a new Date object for today
  const today = new Date();

  // Set hours and minutes to the Date object
  today.setHours(hours, minutes);

  // Convert to local time string based on the provided lang
  // The format (12-hour or 24-hour) is determined by the locale
  const localTimeString = today.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });

  return localTimeString;
}

export function mergeOpeningHours(days: OpeningHourStoryblok[], lang: string) {
  const t = useTranslations(lang);
  const arr = [0, 1, 2, 3, 4, 5, 6];
  let merged = arr.map((d) => {
    /* get opening hours of the day */
    let openString = "";
    days
      .filter((day) => day.day == d + "")
      .map((hours) => {
        openString += `<span>${convertToLocaleTime(hours.time.time.start, lang)} - ${convertToLocaleTime(hours.time.time.end,lang)} </span>`;
      });

    /* get the localized day names */
    let newDay = new Date("08/07/2022");
    newDay.setDate(newDay.getDate() + d);

    const content = {
      day: newDay.toLocaleString(lang, { weekday: "short" }),
      hours: openString !== "" ? openString : t("closed"),
    };
    return content;
  });

  return merged;
}

export function getLocalizedUrl(path: string, lang: string = SITE_LANG): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For default language (English), no prefix needed
  if (lang === SITE_LANG) {
    return `/${cleanPath}`;
  }
  
  // For other languages, add language prefix
  return `/${lang}/${cleanPath}`;
}

export const formatPrice = function (price: string) {
  const formatted = parseFloat(price).toLocaleString(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 2,
  });

  const decimalSeparator = (1.1).toLocaleString(LOCALE).substring(1, 2);
  const parts = formatted.split(decimalSeparator);

  if (parts.length > 1) {
    const wholePart = parts[0];
    const decimalPart = parts[1].replace(/\D/g, "");
    return `<span>${wholePart}<sup class="pl-px opacity-90 font-xxs">${decimalPart}</sup></span>`;
  } else {
    return `<span>${parts[0]}</span>`;
  }
};
