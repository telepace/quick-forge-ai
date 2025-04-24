import type { AxiosRequestConfig, AxiosResponse } from "axios"
import type { ApiRequestOptions } from "./ApiRequestOptions"

type Headers = Record<string, string>
type Middleware<T> = (value: T) => T | Promise<T>
type Resolver<T> = (options: ApiRequestOptions<T>) => Promise<T>

export class Interceptors<T> {
  _fns: Middleware<T>[]

  constructor() {
    this._fns = []
  }

  /**
   * Removes a middleware function from the internal list of middleware functions.
   *
   * @param {Middleware<T>} fn - The middleware function to remove.
   * @returns {void}
   *
   * @example
   * const myMiddleware = (ctx, next) => {
   *   // Middleware logic here
   * };
   * app.use(myMiddleware);
   * app.eject(myMiddleware); // Removes the middleware from the application
   */
  eject(fn: Middleware<T>): void {
    const index = this._fns.indexOf(fn)
    if (index !== -1) {
      this._fns = [...this._fns.slice(0, index), ...this._fns.slice(index + 1)]
    }
  }

  /**
   * Adds a middleware function to the list of middlewares.
   *
   * @param {Middleware<T>} fn - The middleware function to add.
   * @returns {void}
   */
  use(fn: Middleware<T>): void {
    this._fns = [...this._fns, fn]
  }
}

export type OpenAPIConfig = {
  BASE: string
  CREDENTIALS: "include" | "omit" | "same-origin"
  ENCODE_PATH?: ((path: string) => string) | undefined
  HEADERS?: Headers | Resolver<Headers> | undefined
  PASSWORD?: string | Resolver<string> | undefined
  TOKEN?: string | Resolver<string> | undefined
  USERNAME?: string | Resolver<string> | undefined
  VERSION: string
  WITH_CREDENTIALS: boolean
  interceptors: {
    request: Interceptors<AxiosRequestConfig>
    response: Interceptors<AxiosResponse>
  }
}

export const OpenAPI: OpenAPIConfig = {
  BASE: "",
  CREDENTIALS: "include",
  ENCODE_PATH: undefined,
  HEADERS: undefined,
  PASSWORD: undefined,
  TOKEN: undefined,
  USERNAME: undefined,
  VERSION: "0.1.0",
  WITH_CREDENTIALS: false,
  interceptors: {
    request: new Interceptors(),
    response: new Interceptors(),
  },
}
