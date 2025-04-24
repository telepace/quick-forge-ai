"use client"

import type { IconButtonProps, SpanProps } from "@chakra-ui/react"
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react"
import { ThemeProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

export interface ColorModeProviderProps extends ThemeProviderProps {}

/**
 * Provides context for color mode using the ThemeProvider component.
 *
 * @param {Object} props - The properties to pass to the ColorModeProvider.
 * @returns {React.ReactNode} - The rendered ColorModeProvider component.
 */
export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  )
}

export type ColorMode = "light" | "dark"

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
}

/**
 * Hook to toggle and manage the color mode of an application.
 *
 * @returns {Object} An object containing methods for managing the color mode.
 * @property {ColorMode} colorMode - The current color mode of the application, either "light" or "dark".
 * @property {Function} setColorMode - Function to set a specific color mode ("light" or "dark").
 * @property {Function} toggleColorMode - Function to toggle between the current color mode and its opposite.
 *
 * @example
 * import { useColorMode } from 'path-to-module';
 *
 * const App = () => {
 *   const { colorMode, toggleColorMode } = useColorMode();
 *
 *   return (
 *     <div>
 *       <p>Current Color Mode: {colorMode}</p>
 *       <button onClick={toggleColorMode}>Toggle Color Mode</button>
 *     </div>
 *   );
 * };
 */
export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme()
  /**
   * Toggles between dark and light color modes.
   *
   * This function checks the current resolved theme. If it's "dark", it sets the theme to "light". Otherwise, it sets the theme to "dark".
   *
   * @returns {void} - This function does not return anything.
   */
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }
  return {
    colorMode: resolvedTheme as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

/**
 * Returns the appropriate value based on the current color mode.
 *
 * @template T - The type of the values being returned.
 * @param {T} light - The value to return when the color mode is "light".
 * @param {T} dark - The value to return when the color mode is "dark".
 * @returns {T} - The value corresponding to the current color mode.
 *
 * @example
 * // Returns 'lightTheme' if the color mode is "light", otherwise returns 'darkTheme'
 * const theme = useColorModeValue('lightTheme', 'darkTheme');
 */
export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}

/**
 * Renders an icon representing the current color mode of the application.
 * The icon changes based on whether the color mode is "dark" or "light".
 *
 * @function
 * @returns {JSX.Element} - Returns a JSX element representing the icon.
 */
export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? <LuMoon /> : <LuSun />
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode()
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: "5",
            height: "5",
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
})

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    )
  },
)

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    )
  },
)
