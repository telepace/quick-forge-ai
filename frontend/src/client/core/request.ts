import axios from "axios"
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
} from "axios"

import { ApiError } from "./ApiError"
import type { ApiRequestOptions } from "./ApiRequestOptions"
import type { ApiResult } from "./ApiResult"
import { CancelablePromise } from "./CancelablePromise"
import type { OnCancel } from "./CancelablePromise"
import type { OpenAPIConfig } from "./OpenAPI"

/**
 * Checks if the provided value is of type string.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is string} - Returns true if the value is a string, false otherwise.
 */
export const isString = (value: unknown): value is string => {
  return typeof value === "string"
}

/**
 * Checks if the provided value is of type string and not an empty string.
 *
 * @param {unknown} value - The value to be checked.
 * @returns {value is string} - True if the value is a non-empty string, false otherwise.
 * @example
 * if (isStringWithValue("Hello")) {
 *   console.log("It's a non-empty string!");
 * } else {
 *   console.log("It's either not a string or an empty string.");
 * }
 */
export const isStringWithValue = (value: unknown): value is string => {
  return isString(value) && value !== ""
}

/**
 * Determines if the provided value is an instance of Blob.
 *
 * @param {any} value - The value to check.
 * @returns {value is Blob} - Returns true if the value is a Blob, false otherwise.
 *
 * @example
 * const myBlob = new Blob(['Hello, world!'], { type: 'text/plain' });
 * console.log(isBlob(myBlob)); // Output: true
 *
 * const myString = 'Hello, world!';
 * console.log(isBlob(myString)); // Output: false
 */
export const isBlob = (value: any): value is Blob => {
  return value instanceof Blob
}

/**
 * Checks if the provided value is an instance of FormData.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is FormData} - Returns true if the value is an instance of FormData, false otherwise.
 */
export const isFormData = (value: unknown): value is FormData => {
  return value instanceof FormData
}

/**
 * Checks if the provided HTTP status code indicates a successful response.
 *
 * @param {number} status - The HTTP status code to check.
 * @returns {boolean} - True if the status code is between 200 (inclusive) and 300 (exclusive), false otherwise.
 * @throws {TypeError} If the provided parameter is not a number.
 *
 * Example:
 * ```typescript
 * const isOk = isSuccess(200); // true
 * const isNotOk = isSuccess(404); // false
 * ```
 */
export const isSuccess = (status: number): boolean => {
  return status >= 200 && status < 300
}

/**
 * Encodes a string using Base64 encoding.
 *
 * @param {string} str - The string to encode.
 * @returns {string} The encoded string.
 * @throws {Error} Throws an error if the input is not a valid string.
 *
 * @example
 * // Encodes a regular string
 * const encodedString = base64("Hello, world!");
 * console.log(encodedString); // Outputs: "SGVsbG8sIHdvcmxkIQ=="
 */
export const base64 = (str: string): string => {
  try {
    return btoa(str)
  } catch (err) {
    // @ts-ignore
    return Buffer.from(str).toString("base64")
  }
}

/**
 * Generates a query string from an object of parameters.
 *
 * @param {Record<string, unknown>} params - The object containing the parameters to be encoded in the query string.
 * @returns {string} - The generated query string prefixed with '?' if it contains any parameters. Returns an empty string if no parameters are provided.
 * @example
 * // returns '?name=John&age=30'
 * getQueryString({ name: 'John', age: 30 });
 */
export const getQueryString = (params: Record<string, unknown>): string => {
  const qs: string[] = []

  /**
   * Appends a key-value pair to a query string array after encoding both key and value.
   *
   * @param {string} key - The key of the pair to be appended.
   * @param {unknown} value - The value of the pair to be appended. Will be converted to a string before encoding.
   */
  const append = (key: string, value: unknown) => {
    qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
  }

  /**
   * Encodes a key-value pair into a structured format.
   *
   * @param {string} key - The key of the pair.
   * @param {unknown} value - The value associated with the key, which can be any type including undefined and null.
   * @returns {void}
   * @throws {Error} Throws an error if the input types are not as expected.
   *
   * Example:
   * encodePair('user', { name: 'John', age: 30 });
   * // Encodes to: user[name]=John, user[age]=30
   */
  const encodePair = (key: string, value: unknown) => {
    if (value === undefined || value === null) {
      return
    }

    if (value instanceof Date) {
      append(key, value.toISOString())
    } else if (Array.isArray(value)) {
      value.forEach((v) => encodePair(key, v))
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([k, v]) => encodePair(`${key}[${k}]`, v))
    } else {
      append(key, value)
    }
  }

  Object.entries(params).forEach(([key, value]) => encodePair(key, value))

  return qs.length ? `?${qs.join("&")}` : ""
}

/**
 * Constructs a full URL from the provided configuration and options.
 *
 * @param {OpenAPIConfig} config - Configuration object containing API details.
 * @param {ApiRequestOptions} options - Options object with request parameters.
 * @returns {string} The constructed URL.
 *
 * @example
 * const config = {
 *   BASE: 'https://api.example.com',
 *   VERSION: 'v1',
 *   ENCODE_PATH: encodeURIComponent,
 * };
 * const options = {
 *   url: '/user/{userId}',
 *   path: { userId: 123 },
 *   query: { limit: 10 }
 * };
 * const url = getUrl(config, options);
 * console.log(url); // 'https://api.example.com/v1/user/123?limit=10'
 */
const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
  const encoder = config.ENCODE_PATH || encodeURI

  const path = options.url
    .replace("{api-version}", config.VERSION)
    .replace(/{(.*?)}/g, (substring: string, group: string) => {
      if (options.path?.hasOwnProperty(group)) {
        return encoder(String(options.path[group]))
      }
      return substring
    })

  const url = config.BASE + path
  return options.query ? url + getQueryString(options.query) : url
}

/**
 * Creates a FormData object from the provided options.
 *
 * @param {ApiRequestOptions} options - The options containing form data to be converted.
 * @returns {(FormData | undefined)} - A FormData object if options.formData is provided; otherwise, undefined.
 *
 * @example
 * const formData = getFormData({ formData: { key1: 'value1', key2: 'value2' } });
 * console.log(formData); // FormData instance with entries key1 and key2
 */
export const getFormData = (
  options: ApiRequestOptions,
): FormData | undefined => {
  if (options.formData) {
    const formData = new FormData()

    /**
     * Appends a key-value pair to a FormData object. If the value is a string or a Blob, it appends it directly.
     * Otherwise, it converts the value to a JSON string before appending.
     *
     * @param {string} key - The key of the entry.
     * @param {unknown} value - The value of the entry, which can be a string, Blob, or any other type that will be converted to JSON.
     * @returns {void}
     * @throws {TypeError} If the value is not of type string, Blob, or JSON-serializable.
     */
    const process = (key: string, value: unknown) => {
      if (isString(value) || isBlob(value)) {
        formData.append(key, value)
      } else {
        formData.append(key, JSON.stringify(value))
      }
    }

    Object.entries(options.formData)
      .filter(([, value]) => value !== undefined && value !== null)
      .forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => process(key, v))
        } else {
          process(key, value)
        }
      })

    return formData
  }
  return undefined
}

type Resolver<T> = (options: ApiRequestOptions<T>) => Promise<T>

/**
 * Resolves a value or uses a resolver function to fetch a value asynchronously.
 *
 * @template T - The type of the value being resolved.
 * @param {ApiRequestOptions<T>} options - Options for making an API request, if needed by the resolver.
 * @param {T | Resolver<T>} [resolver=undefined] - A value or a function that returns a value. If a function is provided, it will be called with `options` as its argument.
 * @returns {Promise<T | undefined>} A promise that resolves to the resolved value or `undefined` if no resolver is provided.
 *
 * @example
 * // Example of using a static value as the resolver
 * const result = await resolve({ url: 'https://api.example.com/data' }, 42);
 * console.log(result); // Output: 42
 *
 * @example
 * // Example of using a function as the resolver
 * const fetchData = async (options) => {
 *   const response = await fetch(options.url);
 *   return response.json();
 * };
 * const result = await resolve({ url: 'https://api.example.com/data' }, fetchData);
 * console.log(result); // Output: data fetched from the API
 */
export const resolve = async <T>(
  options: ApiRequestOptions<T>,
  resolver?: T | Resolver<T>,
): Promise<T | undefined> => {
  if (typeof resolver === "function") {
    return (resolver as Resolver<T>)(options)
  }
  return resolver
}

/**
 * Generates HTTP headers based on the provided configuration and options.
 *
 * @template T - The type of the API response body.
 * @param {OpenAPIConfig} config - The OpenAPI configuration object containing token, username, password, and additional headers.
 * @param {ApiRequestOptions<T>} options - The request options including headers and body details.
 * @returns {Promise<Record<string, string>>} A promise that resolves to a record of header key-value pairs.
 * @throws {Error} Throws an error if the configuration or options are invalid.
 *
 * @example
 * const config = {
 *   TOKEN: "your_token",
 *   USERNAME: "your_username",
 *   PASSWORD: "your_password",
 *   HEADERS: {
 *     "Custom-Header": "value"
 *   }
 * };
 *
 * const options = {
 *   headers: {
 *     "Accept-Language": "en-US"
 *   },
 *   body: JSON.stringify({ key: "value" }),
 *   mediaType: "application/json"
 * };
 *
 * getHeaders(config, options).then(headers => {
 *   console.log(headers);
 * });
 */
export const getHeaders = async <T>(
  config: OpenAPIConfig,
  options: ApiRequestOptions<T>,
): Promise<Record<string, string>> => {
  const [token, username, password, additionalHeaders] = await Promise.all([
    // @ts-ignore
    resolve(options, config.TOKEN),
    // @ts-ignore
    resolve(options, config.USERNAME),
    // @ts-ignore
    resolve(options, config.PASSWORD),
    // @ts-ignore
    resolve(options, config.HEADERS),
  ])

  const headers = Object.entries({
    Accept: "application/json",
    ...additionalHeaders,
    ...options.headers,
  })
    .filter(([, value]) => value !== undefined && value !== null)
    .reduce(
      (headers, [key, value]) => ({
        ...headers,
        [key]: String(value),
      }),
      {} as Record<string, string>,
    )

  if (isStringWithValue(token)) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (isStringWithValue(username) && isStringWithValue(password)) {
    const credentials = base64(`${username}:${password}`)
    headers["Authorization"] = `Basic ${credentials}`
  }

  if (options.body !== undefined) {
    if (options.mediaType) {
      headers["Content-Type"] = options.mediaType
    } else if (isBlob(options.body)) {
      headers["Content-Type"] = options.body.type || "application/octet-stream"
    } else if (isString(options.body)) {
      headers["Content-Type"] = "text/plain"
    } else if (!isFormData(options.body)) {
      headers["Content-Type"] = "application/json"
    }
  } else if (options.formData !== undefined) {
    if (options.mediaType) {
      headers["Content-Type"] = options.mediaType
    }
  }

  return headers
}

/**
 * Retrieves the request body from the provided options.
 *
 * @param {ApiRequestOptions} options - The options object containing the request details.
 * @returns {unknown | undefined} - The request body if it exists, otherwise undefined.
 *
 * Example:
 * const options = {
 *   body: {
 *     key: 'value'
 *   }
 * };
 * const requestBody = getRequestBody(options);
 * console.log(requestBody); // Output: { key: 'value' }
 */
export const getRequestBody = (options: ApiRequestOptions): unknown => {
  if (options.body) {
    return options.body
  }
  return undefined
}

/**
 * Sends an HTTP request using Axios with specified configuration and options.
 *
 * @template T - The expected type of the response data.
 * @param {OpenAPIConfig} config - Configuration object containing various settings.
 * @param {ApiRequestOptions<T>} options - Request options including method, headers, etc.
 * @param {string} url - The URL to which the request is sent.
 * @param {unknown} body - The request body data.
 * @param {FormData | undefined} formData - Optional form data for multipart requests.
 * @param {Record<string, string>} headers - Additional HTTP headers.
 * @param {OnCancel} onCancel - Callback function to handle cancellation of the request.
 * @param {AxiosInstance} axiosClient - Axios client instance to perform the request.
 * @returns {Promise<AxiosResponse<T>>} A promise resolving to an Axios response with the expected data type.
 * @throws {AxiosError<T>} If an error occurs during the request, throws an Axios error with a response if available.
 *
 * @example
 * sendRequest(config, options, '/endpoint', bodyData, undefined, headers, onCancel, axiosInstance)
 *   .then(response => {
 *     console.log(response.data);
 *   })
 *   .catch(error => {
 *     if (axios.isAxiosError(error)) {
 *       console.error('Request failed:', error.response?.data);
 *     } else {
 *       console.error('Unexpected error:', error);
 *     }
 *   });
 */
export const sendRequest = async <T>(
  config: OpenAPIConfig,
  options: ApiRequestOptions<T>,
  url: string,
  body: unknown,
  formData: FormData | undefined,
  headers: Record<string, string>,
  onCancel: OnCancel,
  axiosClient: AxiosInstance,
): Promise<AxiosResponse<T>> => {
  const controller = new AbortController()

  let requestConfig: AxiosRequestConfig = {
    data: body ?? formData,
    headers,
    method: options.method,
    signal: controller.signal,
    url,
    withCredentials: config.WITH_CREDENTIALS,
  }

  onCancel(() => controller.abort())

  for (const fn of config.interceptors.request._fns) {
    requestConfig = await fn(requestConfig)
  }

  try {
    return await axiosClient.request(requestConfig)
  } catch (error) {
    const axiosError = error as AxiosError<T>
    if (axiosError.response) {
      return axiosError.response
    }
    throw error
  }
}

/**
 * Retrieves the value of a specific response header from an Axios response.
 *
 * @param {AxiosResponse<unknown>} response - The Axios response object containing the headers.
 * @param {string} [responseHeader] - Optional. The name of the header to retrieve. If not provided, returns undefined.
 * @returns {string | undefined} - The value of the specified header if it exists and is a string; otherwise, undefined.
 *
 * @example
 * const response = await axios.get('https://api.example.com/data');
 * const contentType = getResponseHeader(response, 'Content-Type');
 * console.log(contentType); // Output: application/json
 */
export const getResponseHeader = (
  response: AxiosResponse<unknown>,
  responseHeader?: string,
): string | undefined => {
  if (responseHeader) {
    const content = response.headers[responseHeader]
    if (isString(content)) {
      return content
    }
  }
  return undefined
}

/**
 * Extracts the response body from an AxiosResponse object.
 *
 * @param {AxiosResponse<unknown>} response - The AxiosResponse object to extract data from.
 * @returns {unknown} - The response data if the status is not 204, otherwise undefined.
 * @throws {Error} - Throws an error if the input is not a valid AxiosResponse object.
 */
export const getResponseBody = (response: AxiosResponse<unknown>): unknown => {
  if (response.status !== 204) {
    return response.data
  }
  return undefined
}

/**
 * Catches errors from API requests based on the HTTP status code.
 *
 * @param {ApiRequestOptions} options - Options for the API request.
 * @param {ApiResult} result - Result of the API request.
 * @returns {void}
 * @throws {ApiError} If an error is found in the response, throws an ApiError with details.
 */
export const catchErrorCodes = (
  options: ApiRequestOptions,
  result: ApiResult,
): void => {
  const errors: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "Im a teapot",
    421: "Misdirected Request",
    422: "Unprocessable Content",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required",
    ...options.errors,
  }

  const error = errors[result.status]
  if (error) {
    throw new ApiError(options, result, error)
  }

  if (!result.ok) {
    const errorStatus = result.status ?? "unknown"
    const errorStatusText = result.statusText ?? "unknown"
    const errorBody = (() => {
      try {
        return JSON.stringify(result.body, null, 2)
      } catch (e) {
        return undefined
      }
    })()

    throw new ApiError(
      options,
      result,
      `Generic Error: status: ${errorStatus}; status text: ${errorStatusText}; body: ${errorBody}`,
    )
  }
}

/**
 * Sends an HTTP request using the provided configuration and options.
 *
 * @param {OpenAPIConfig} config - The OpenAPI configuration object containing details about the API endpoint.
 * @param {ApiRequestOptions<T>} options - The request options including headers, body, formData, etc.
 * @param {AxiosInstance} [axiosClient=axios] - Optional axios client instance to use for making the request. Defaults to the global axios instance.
 * @returns {CancelablePromise<T>} A cancelable promise that resolves with the response body or rejects with an error.
 * @throws {ApiError} Throws an ApiError if an error occurs during the request.
 *
 * Example usage:
 * request(config, options).then(response => {
 *   console.log(response.body);
 * }).catch(error => {
 *   console.error('Request failed:', error);
 * });
 */
export const request = <T>(
  config: OpenAPIConfig,
  options: ApiRequestOptions<T>,
  axiosClient: AxiosInstance = axios,
): CancelablePromise<T> => {
  return new CancelablePromise(async (resolve, reject, onCancel) => {
    try {
      const url = getUrl(config, options)
      const formData = getFormData(options)
      const body = getRequestBody(options)
      const headers = await getHeaders(config, options)

      if (!onCancel.isCancelled) {
        let response = await sendRequest<T>(
          config,
          options,
          url,
          body,
          formData,
          headers,
          onCancel,
          axiosClient,
        )

        for (const fn of config.interceptors.response._fns) {
          response = await fn(response)
        }

        const responseBody = getResponseBody(response)
        const responseHeader = getResponseHeader(
          response,
          options.responseHeader,
        )

        let transformedBody = responseBody
        if (options.responseTransformer && isSuccess(response.status)) {
          transformedBody = await options.responseTransformer(responseBody)
        }

        const result: ApiResult = {
          url,
          ok: isSuccess(response.status),
          status: response.status,
          statusText: response.statusText,
          body: responseHeader ?? transformedBody,
        }

        catchErrorCodes(options, result)

        resolve(result.body)
      }
    } catch (error) {
      reject(error)
    }
  })
}
