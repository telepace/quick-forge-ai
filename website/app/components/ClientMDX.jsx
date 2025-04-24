"use client"

import React from 'react'

// 客户端MDX包装组件
// 用于包装需要使用MDX组件的内容，确保它们在客户端渲染
/**
 * A React component that renders its children without any modifications.
 *
 * @param {Object} props - The component's props.
 * @prop {JSX.Element} children - The JSX elements to be rendered by the component.
 * @returns {JSX.Element} - Returns the unmodified children wrapped in a React fragment.
 *
 * Example usage:
 * <ClientMDX>
 *   <h1>Hello, World!</h1>
 * </ClientMDX>
 */
export default function ClientMDX({ children }) {
  return <>{children}</>
} 