// Single source of truth for supported languages
export const SUPPORTED_LOCALES = ['en', 'sv'] as const;
export const DEFAULT_LOCALE = 'en';

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

// Language display names for UI
export const LANGUAGE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  sv: 'Svenska',
};

// Language flags/icons (if needed)
export const LANGUAGE_FLAGS: Record<SupportedLocale, string> = {
  en: '/flag-gb.svg',
  sv: '/flag-sv.svg',
};