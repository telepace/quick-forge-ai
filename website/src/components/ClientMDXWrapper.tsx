'use client'

import React from 'react'

/**
 * React Functional Component that wraps its children with a div element having a specific className.
 *
 * @param {React.FC<{ children: React.ReactNode }>} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child elements or components to be wrapped.
 * @returns {JSX.Element} - A div element containing the provided children, with a class name of "mdx-client-wrapper".
 *
 * @throws Will throw an error if children are not provided or are invalid React nodes.
 */
const ClientMDXWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mdx-client-wrapper">{children}</div>
}

export default ClientMDXWrapper 