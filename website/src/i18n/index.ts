import en from './en'
import zh from './zh'

export const i18nConfig = Object.freeze({
  en,
  zh,
})

export type I18nLangKeys = keyof typeof i18nConfig
export interface I18nLangAsyncProps {
  lang: I18nLangKeys
}

// 获取所有语言对象的联合类型
export type AllLocales = typeof i18nConfig[I18nLangKeys]


type DeepKeys<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K & string | number}.${DeepKeys<T[K]>}`
    : `${K & string | number}`
}[keyof T & (string | number)]


export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

// 获取所有可能的键
export type LocaleKeys = NestedKeyOf<AllLocales>


type DeepObject = Record<string, any>

// 类型提取给定路径上值的类型
export type PathValue<T, P extends string> =
  P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? PathValue<T[Key], Rest>
      : never
    : P extends keyof T
      ? T[P]
      : never

// 获取嵌套值
/**
 * Retrieves the value from a deeply nested object using a dot-separated path string.
 *
 * @template T - The type of the deep object.
 * @template K - The type of the path string, constrained to be a valid property path of `T`.
 * @param {T} obj - The deep object to retrieve the value from.
 * @param {K} path - A dot-separated string representing the path to the desired value within the object.
 * @returns {PathValue<T, K>} The value located at the specified path in the object.
 *
 * @example
 * const user = {
 *   name: 'John',
 *   address: {
 *     city: 'New York'
 *   }
 * };
 * const city = getNestedValue(user, 'address.city'); // Returns 'New York'
 */
export function getNestedValue<T extends DeepObject, K extends string>(obj: T, path: K): PathValue<T, K> {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj) as PathValue<T, K>
}


// 插入值表达式
/**
 * Interpolates values into a string template using context data.
 *
 * @param {string} template - The string template containing placeholders in the format `{{key}}` or `{{object.key}}`.
 * @param {Record<string, any>} context - An object where keys correspond to placeholder names and values are the interpolated data.
 * @returns {string} The interpolated string with placeholders replaced by corresponding values from the context. If a value is not found in the context, it remains unchanged.
 *
 * @example
 * // Example usage:
 * const template = "Hello, {{user.name}}! You have {{notifications.length}} notifications.";
 * const context = { user: { name: 'Alice' }, notifications: [1, 2, 3] };
 * const result = interpolateString(template, context);
 * console.log(result); // Output: "Hello, Alice! You have 3 notifications."
 */
export function interpolateString(template: string, context: Record<string, any>): string {
  return template.replace(/\{\{\s*(\w+(\.\w+)*)\s*\}\}/g, (_, path) => {
    const value = getNestedValue(context, path.trim())
    return value !== undefined ? value : `{{${path.trim()}}}`
  })
}
