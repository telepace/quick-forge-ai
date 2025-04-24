export class CancelError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CancelError"
  }

  public get isCancelled(): boolean {
    return true
  }
}

export interface OnCancel {
  readonly isResolved: boolean
  readonly isRejected: boolean
  readonly isCancelled: boolean

  (cancelHandler: () => void): void
}

export class CancelablePromise<T> implements Promise<T> {
  private _isResolved: boolean
  private _isRejected: boolean
  private _isCancelled: boolean
  readonly cancelHandlers: (() => void)[]
  readonly promise: Promise<T>
  private _resolve?: (value: T | PromiseLike<T>) => void
  private _reject?: (reason?: unknown) => void

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: unknown) => void,
      onCancel: OnCancel,
    ) => void,
  ) {
    this._isResolved = false
    this._isRejected = false
    this._isCancelled = false
    this.cancelHandlers = []
    this.promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject

      /**
       * Resolves the promise with the given value.
       *
       * @param {T | PromiseLike<T>} value - The value to resolve the promise with.
       * @returns {void} This function does not return a value.
       *
       * @throws {Error} If the promise has already been resolved, rejected, or cancelled.
       */
      const onResolve = (value: T | PromiseLike<T>): void => {
        if (this._isResolved || this._isRejected || this._isCancelled) {
          return
        }
        this._isResolved = true
        if (this._resolve) this._resolve(value)
      }

      /**
       * Rejects the promise if it hasn't already been resolved, rejected, or cancelled.
       *
       * @param {unknown} [reason] - The reason for rejecting the promise. If not provided, the promise will be rejected with a default error message.
       * @returns {void}
       *
       * Example:
       * ```
       * myPromise.onReject('An error occurred');
       * ```
       */
      const onReject = (reason?: unknown): void => {
        if (this._isResolved || this._isRejected || this._isCancelled) {
          return
        }
        this._isRejected = true
        if (this._reject) this._reject(reason)
      }

      /**
       * Registers a callback function to handle cancellation of an operation.
       *
       * @param {() => void} cancelHandler - The function to be called when the operation is cancelled.
       * @returns {void}
       * @throws {Error} If the operation has already been resolved, rejected, or cancelled.
       */
      const onCancel = (cancelHandler: () => void): void => {
        if (this._isResolved || this._isRejected || this._isCancelled) {
          return
        }
        this.cancelHandlers.push(cancelHandler)
      }

      Object.defineProperty(onCancel, "isResolved", {
        get: (): boolean => this._isResolved,
      })

      Object.defineProperty(onCancel, "isRejected", {
        get: (): boolean => this._isRejected,
      })

      Object.defineProperty(onCancel, "isCancelled", {
        get: (): boolean => this._isCancelled,
      })

      return executor(onResolve, onReject, onCancel as OnCancel)
    })
  }

  get [Symbol.toStringTag]() {
    return "Cancellable Promise"
  }

  public then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onFulfilled, onRejected)
  }

  /**
   * Attaches a callback to the promise that will be called when the promise is rejected.
   *
   * @template TResult - The type of the value returned by the onRejected callback.
   * @param {((reason: unknown) => TResult | PromiseLike<TResult>) | null} [onRejected] - An optional function that will handle the rejection. If not provided, any rejection will propagate.
   * @returns {Promise<T | TResult>} A new promise that will resolve with the value returned by onRejected or reject with the reason if onRejected is not provided and the original promise rejects.
   *
   * Example:
   * myPromise.catch((error) => {
   *   console.error('An error occurred:', error);
   *   return 'Default Value';
   * });
   */
  public catch<TResult = never>(
    onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ): Promise<T | TResult> {
    return this.promise.catch(onRejected)
  }

  /**
   * Attaches a callback to handle both successful completion and error handling of the Promise.
   *
   * @param {(() => void) | null} onFinally - Optional callback function that runs whether the Promise resolves or rejects. If not provided, no action will be taken during finally processing.
   * @returns {Promise<T>} - A new Promise that is resolved with the same value as the original Promise.
   *
   * @example
   * myPromise.finally(() => {
   *   console.log('This will run regardless of the Promise outcome.');
   * });
   */
  public finally(onFinally?: (() => void) | null): Promise<T> {
    return this.promise.finally(onFinally)
  }

  /**
   * Cancels the operation associated with this instance.
   *
   * This method will call all registered cancellation handlers and then reject the promise
   * with a `CancelError` if it has not already been resolved or rejected. If an error occurs
   * during the execution of any cancellation handler, it will be logged as a warning but will
   * not prevent the cancellation process from continuing.
   *
   * @returns {void}
   */
  public cancel(): void {
    if (this._isResolved || this._isRejected || this._isCancelled) {
      return
    }
    this._isCancelled = true
    if (this.cancelHandlers.length) {
      try {
        for (const cancelHandler of this.cancelHandlers) {
          cancelHandler()
        }
      } catch (error) {
        console.warn("Cancellation threw an error", error)
        return
      }
    }
    this.cancelHandlers.length = 0
    if (this._reject) this._reject(new CancelError("Request aborted"))
  }

  public get isCancelled(): boolean {
    return this._isCancelled
  }
}
