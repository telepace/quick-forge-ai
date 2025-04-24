"use client"

import { toaster } from "@/components/ui/toaster"

const useCustomToast = () => {
  /**
   * Displays a success toast notification.
   *
   * @param {string} description - The message to display in the toast.
   */
  const showSuccessToast = (description: string) => {
    toaster.create({
      title: "Success!",
      description,
      type: "success",
    })
  }

  /**
   * Displays an error toast notification with the provided description.
   *
   * @param {string} description - The description of the error to be displayed in the toast.
   */
  const showErrorToast = (description: string) => {
    toaster.create({
      title: "Something went wrong!",
      description,
      type: "error",
    })
  }

  return { showSuccessToast, showErrorToast }
}

export default useCustomToast
