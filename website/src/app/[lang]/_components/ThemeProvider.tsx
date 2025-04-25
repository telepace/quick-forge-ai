'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'

/**
 * Provides theme context using NextThemesProvider from the `next-themes` package.
 *
 * @param {React.ReactNode} children - The child components that will have access to the theme context.
 * @param {...React.ComponentProps<typeof NextThemesProvider>} props - Additional properties to pass to NextThemesProvider.
 * @returns {JSX.Element} - The rendered component with the theme provider applied.
 *
 * @example
 * import React from 'react';
 * import ThemeProvider from './ThemeProvider';
 * import { Theme } from 'next-themes';
 *
 * const App = () => (
 *   <ThemeProvider>
 *     <Theme initialTheme="dark">
 *       <YourComponent />
 *     </Theme>
 *   </ThemeProvider>
 * );
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
