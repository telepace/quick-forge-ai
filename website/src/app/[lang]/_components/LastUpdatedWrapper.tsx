'use client'

import { LastUpdated } from 'nextra-theme-docs'
import React from 'react'

export function LastUpdatedWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LastUpdated>
      {children}
    </LastUpdated>
  )
} 