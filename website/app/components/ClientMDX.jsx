"use client"

import React from 'react'

// Client MDX wrapper component
// Used to wrap content that needs to use MDX components, ensuring they are rendered on the client side
export default function ClientMDX({ children }) {
  return <>{children}</>
} 