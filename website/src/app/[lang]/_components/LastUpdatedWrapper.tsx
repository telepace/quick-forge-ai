'use client'

import { LastUpdated } from 'nextra-theme-docs'
import React from 'react'

/**
 * Wraps its children with the LastUpdated component.
 *
 * @param {Object} props - The properties for the LastUpdatedWrapper component.
 * @param {React.ReactNode} props.children - The React elements to be wrapped by the LastUpdated component.
 *
 * @returns {JSX.Element} - A JSX element that renders the children within a LastUpdated wrapper.
 */
export function LastUpdatedWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LastUpdated>
      {children}
    </LastUpdated>
  )
} 