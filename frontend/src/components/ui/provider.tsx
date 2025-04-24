"use client"

import { ChakraProvider } from "@chakra-ui/react"
import React, { type PropsWithChildren } from "react"
import { system } from "../../theme"
import { ColorModeProvider } from "./color-mode"
import { Toaster } from "./toaster"

/**
 * Provides necessary context and styling to its child components using Chakra UI.
 *
 * @param {PropsWithChildren} props - The component properties, which includes children to render.
 * @returns {JSX.Element} A JSX element that renders the custom provider with ChakraProvider, ColorModeProvider, and Toaster components.
 *
 * @example
 * <CustomProvider>
 *   <MyComponent />
 * </CustomProvider>
 */
export function CustomProvider(props: PropsWithChildren) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider defaultTheme="light">
        {props.children}
      </ColorModeProvider>
      <Toaster />
    </ChakraProvider>
  )
}
