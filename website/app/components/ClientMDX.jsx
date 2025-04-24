"use client"

import React from 'react'

// 客户端MDX包装组件
// 用于包装需要使用MDX组件的内容，确保它们在客户端渲染
export default function ClientMDX({ children }) {
  return <>{children}</>
} 