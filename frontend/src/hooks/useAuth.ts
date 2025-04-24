import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import {
  type Body_login_login_access_token as AccessToken,
  type ApiError,
  LoginService,
  type UserPublic,
  type UserRegister,
  UsersService,
} from "@/client"
import { handleError } from "@/utils"

/**
 * Checks if the user is currently logged in by verifying the presence of an access token in localStorage.
 *
 * @returns {boolean} - Returns true if the user is logged in, false otherwise.
 */
const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null
}

/**
 * Custom hook that manages user authentication processes.
 * @returns {object} An object containing authentication-related data and functions.
 */
const useAuth = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: user } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"],
    queryFn: UsersService.readUserMe,
    enabled: isLoggedIn(),
  })

  const signUpMutation = useMutation({
    mutationFn: (data: UserRegister) =>
      UsersService.registerUser({ requestBody: data }),

    onSuccess: () => {
      navigate({ to: "/login" })
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  /**
   * Logs in a user using an access token.
   *
   * @async
   * @function login
   * @param {AccessToken} data - The access token data to be used for logging in.
   * @throws {Error} - If the login process fails or encounters an error.
   */
  const login = async (data: AccessToken) => {
    const response = await LoginService.loginAccessToken({
      formData: data,
    })
    localStorage.setItem("access_token", response.access_token)
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate({ to: "/" })
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
  })

  /**
   * Logs out the user by removing the access token from local storage and navigating to the login page.
   *
   * @function logout
   * @returns {void} This function does not return any value.
   *
   * Example usage:
   * logout();
   */
  const logout = () => {
    localStorage.removeItem("access_token")
    navigate({ to: "/login" })
  }

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    error,
    resetError: () => setError(null),
  }
}

export { isLoggedIn }
export default useAuth
