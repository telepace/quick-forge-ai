'use client'

import React from 'react'

const ClientMDXWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mdx-client-wrapper">{children}</div>
}

export default ClientMDXWrapper 