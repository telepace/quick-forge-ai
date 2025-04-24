import type { ApiError } from "./client"
import useCustomToast from "./hooks/useCustomToast"

export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Invalid email address",
}

export const namePattern = {
  value: /^[A-Za-z\s\u00C0-\u017F]{1,30}$/,
  message: "Invalid name",
}

/**
 * Generates a set of password rules based on the given requirements.
 *
 * @param {boolean} [isRequired=true] - Indicates whether the password is required. Default is true.
 * @returns {Object} An object containing password validation rules.
 * @property {number} minLength.value - The minimum length of the password.
 * @property {string} minLength.message - The error message to display if the password is too short.
 * @property {string|undefined} required - Error message indicating that the password is required, only present if `isRequired` is true.
 * @example
 * // Basic usage with default parameters
 * const rules = passwordRules();
 * console.log(rules);
 *
 * // Usage with custom requirements
 * const optionalPasswordRules = passwordRules(false);
 * console.log(optionalPasswordRules);
 */
export const passwordRules = (isRequired = true) => {
  const rules: any = {
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
  }

  if (isRequired) {
    rules.required = "Password is required"
  }

  return rules
}

/**
 * Generates rules for validating password confirmation.
 *
 * @param {Function} getValues - A function that returns an object containing the form values. It should return either `password` or `new_password`.
 * @param {boolean} [isRequired=true] - Indicates whether the password confirmation is required.
 * @returns {Object} An object containing validation rules.
 *
 * @example
 * const getValues = () => ({ new_password: '123456' });
 * const rules = confirmPasswordRules(getValues, true);
 * console.log(rules.validate('123456')); // true
 * console.log(rules.validate('123457')); // "The passwords do not match"
 */
export const confirmPasswordRules = (
  getValues: () => any,
  isRequired = true,
) => {
  const rules: any = {
    validate: (value: string) => {
      const password = getValues().password || getValues().new_password
      return value === password ? true : "The passwords do not match"
    },
  }

  if (isRequired) {
    rules.required = "Password confirmation is required"
  }

  return rules
}

/**
 * Handles an error by displaying it to the user using a toast notification.
 *
 * @param {ApiError} err - The error object received from the API.
 */
export const handleError = (err: ApiError) => {
  const { showErrorToast } = useCustomToast()
  const errDetail = (err.body as any)?.detail
  let errorMessage = errDetail || "Something went wrong."
  if (Array.isArray(errDetail) && errDetail.length > 0) {
    errorMessage = errDetail[0].msg
  }
  showErrorToast(errorMessage)
}
