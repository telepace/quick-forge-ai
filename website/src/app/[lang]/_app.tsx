'use client'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'

/**
 * 处理Nextra样式水合和加载问题的全局App组件
 */
export default function App({ Component, pageProps }: AppProps) {
  // 处理页面加载时的样式修复
  useEffect(() => {
    // 移除任何影响水合的样式
    const cleanupStyles = () => {
      document.querySelectorAll('style').forEach(style => {
        if (style.textContent?.includes('body {transition:') ||
            style.textContent?.includes('body[unresolved]')) {
          style.remove()
        }
      })
    }
    
    // 执行清理
    cleanupStyles()
    
    // 设置观察器持续监控样式注入
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          cleanupStyles()
        }
      })
    })
    
    observer.observe(document.head, { 
      childList: true,
      subtree: true 
    })
    
    return () => observer.disconnect()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Component {...pageProps} />
    </ThemeProvider>
  )
} 