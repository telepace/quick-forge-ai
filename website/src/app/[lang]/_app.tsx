'use client'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'

/**
 * 全局App组件，处理Nextra样式水合和加载问题。
 *
 * @param {AppProps} props - 组件的属性对象，包含Component和pageProps。
 */
export default function App({ Component, pageProps }: AppProps) {
  // 处理页面加载时的样式修复
  useEffect(() => {
    // 移除任何影响水合的样式
    /**
     * Removes styles from the document that contain specific CSS properties.
     * This function targets and removes `<style>` elements containing transitions on the body or unresolved state.
     *
     * @returns {void}
     */
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