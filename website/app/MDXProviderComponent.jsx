"use client"

import React from 'react'
import { MDXProvider } from '@mdx-js/react'

// 基础MDX组件
const components = {
  h1: props => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: props => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
  h3: props => <h3 className="text-2xl font-bold mt-5 mb-2" {...props} />,
  p: props => <p className="my-4" {...props} />,
  ul: props => <ul className="list-disc pl-5 my-4" {...props} />,
  ol: props => <ol className="list-decimal pl-5 my-4" {...props} />,
  li: props => <li className="my-1" {...props} />,
  a: props => <a className="text-blue-600 hover:underline" {...props} />,
  blockquote: props => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
}

// MDX提供器组件
/**
 * A component that provides an MDX context to its children.
 *
 * @param {Object} props - The properties of the component.
 * @param {React.ReactNode} props.children - The child elements to render within the MDX provider.
 * @returns {React.ReactNode} - The rendered component.
 */
export default function MDXProviderComponent({ children }) {
  return (
    <MDXProvider components={components}>
      {children}
    </MDXProvider>
  )
} 