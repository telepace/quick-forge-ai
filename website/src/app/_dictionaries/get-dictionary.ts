import type Zh from '@/i18n/zh'
import 'server-only'

// We enumerate all dictionaries here for better linting and TypeScript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import('@/i18n/en'),
  zh: () => import('@/i18n/zh'),
} as const satisfies Record<string, () => Promise<{ default: typeof Zh }>>

/**
 * Retrieves a dictionary for a given locale asynchronously.
 *
 * @async
 * @function getDictionary
 * @param {keyof typeof dictionaries} locale - The locale identifier for the desired dictionary.
 * @returns {Promise<typeof Zh>} A Promise that resolves to the default export of the specified dictionary module.
 * @throws {Error} If the provided locale is not supported or an error occurs while loading the dictionary.
 *
 * @example
 * // Usage example:
 * getDictionary('zh').then(dictionary => {
 *   console.log(dictionary);
 * }).catch(error => {
 *   console.error('Failed to load dictionary:', error);
 * });
 */
export const getDictionary = async (
  locale: keyof typeof dictionaries,
): Promise<typeof Zh> => (await dictionaries[locale]()).default

/**
 * Determines the text direction based on the provided locale.
 *
 * @param {keyof typeof dictionaries} locale - The locale for which to determine the direction. Supported values are 'en' and 'zh'.
 * @returns {'ltr'} - The text direction, which is always 'ltr' (left-to-right) for the specified locales.
 * @throws {Error} - Throws an error if the provided locale is not one of the supported values ('en' or 'zh').
 *
 * @example
 * // Returns 'ltr'
 * getDirection('en');
 *
 * @example
 * // Returns 'ltr'
 * getDirection('zh');
 */
export const getDirection = (locale: keyof typeof dictionaries) => {
  switch (locale) {
    case 'en':
    case 'zh':
    default:
      return 'ltr' as const
  }
}
