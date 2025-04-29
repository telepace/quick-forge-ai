'use client'

import { useEffect } from 'react'

/**
 * 这个函数用于修复Nextra样式水合问题。
 * 它通过在客户端渲染时移除可能导致冲突的样式元素来实现这一目标。
 *
 * @returns {null} - 该函数不返回任何值，始终返回null。
 */
export function NextraStyleFix() {
  useEffect(() => {
    // 处理可能存在的样式冲突
    /**
     * Handles the removal of specific style tags from the document.
     *
     * This function searches for all `<style>` elements in the document and removes those
     * that contain either 'body {transition:' or 'body[unresolved]' in their text content.
     */
    const handleStyleFix = () => {
      // 查找包含body transition的样式标签并移除
      document.querySelectorAll('style').forEach(styleEl => {
        if (styleEl.textContent?.includes('body {transition:') || 
            styleEl.textContent?.includes('body[unresolved]')) {
          styleEl.remove()
        }
      })
    }
    
    // 执行清理
    handleStyleFix()
    
    // 对于动态加载的样式，可以设置一个观察器
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          handleStyleFix()
        }
      })
    })
    
    observer.observe(document.head, { 
      childList: true,
      subtree: true 
    })
    
    return () => observer.disconnect()
  }, [])
  
  return null
}

/**
 * A React functional component that wraps content with specific styling and layout for documentation purposes.
 *
 * @param {React.ReactNode} children - The child components or elements to be rendered within the wrapper.
 * @param {any} [toc] - An optional table of contents data, which can be used to render a sidebar or other navigational elements.
 * @param {any} [metadata] - Optional metadata related to the content, which could include author information, creation date, etc.
 *
 * @returns {JSX.Element} A JSX element representing the styled and laid-out content container.
 */
export const NextraContentWrapper: React.FC<{
  children: React.ReactNode,
  toc?: any,
  metadata?: any
}> = ({ children, toc, metadata }) => {
  const { theme } = useTheme()

  return (
    <div className="nextra-content-container nx-mx-auto nx-max-w-[90rem]">
      <article className="nextra-content nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-w-full nx-px-6 nx-pb-8 md:nx-pl-[max(env(safe-area-inset-left),1.5rem)] md:nx-pr-[max(env(safe-area-inset-right),1.5rem)]">
        <main className="nextra-body nx-w-full nx-break-words">
          {children}
        </main>
      </article>
    </div>
  )
} 