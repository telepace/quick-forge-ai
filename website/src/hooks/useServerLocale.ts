/* eslint-disable react-hooks-extra/no-unnecessary-use-prefix */
import type { AllLocales, I18nLangKeys, LocaleKeys, PathValue } from '@/i18n'
import { getNestedValue, i18nConfig, interpolateString } from '@/i18n'

// 类型获取给定键的本地化值的类型
type LocalizedValue<T, K extends LocaleKeys> = PathValue<T, K> extends string
  ? string
  : PathValue<T, K>

interface ServerLocaleParams {
  params: {
    lang?: string
  }
}

/**
 * 获取服务器端语言并提供翻译函数。
 *
 * @async
 * @function useServerLocale
 * @param {I18nLangKeys} lang - 当前的语言键。
 * @returns {Object} 包含当前语言和翻译函数的对象。
 * @example
 * const { currentLocale, t } = await useServerLocale('en');
 * console.log(currentLocale); // 输出: 'en'
 * console.log(t('greeting')); // 输出根据配置的语言进行翻译
 */
export async function useServerLocale(lang: I18nLangKeys) {
  // 从参数中获取当前语言
  const currentLocale = lang

  /**
   * Translates a key to a localized value using the provided data.
   *
   * @template K - The type of the locale key.
   * @param {K} key - The locale key to translate.
   * @param {Record<string, any>} [withData={}] - Data to interpolate into the template string.
   * @returns {LocalizedValue<AllLocales, K>} - The localized value corresponding to the key.
   * @throws {Error} - Throws an error if the key is not found in the i18n configuration.
   *
   * @example
   * // Assuming 'currentLocale' is set to 'en'
   * // and 'i18nConfig.en' contains {'greeting': 'Hello, {name}!'}
   * const localizedGreet = t('greeting', { name: 'World' });
   * console.log(localizedGreet); // Output: "Hello, World!"
   */
  function t<K extends LocaleKeys>(
    key: K,
    withData: Record<string, any> = {},
  ): LocalizedValue<AllLocales, K> {
    const template = getNestedValue(i18nConfig[currentLocale], key)

    if (typeof template === 'string') {
      return interpolateString(template, withData) as LocalizedValue<AllLocales, K>
    }

    return template as LocalizedValue<AllLocales, K>
  }

  return {
    currentLocale,
    t,
  }
}
