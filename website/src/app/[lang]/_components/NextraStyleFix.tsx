'use client'

import { useEffect } from 'react'

/**
 * 这个组件用于修复Nextra样式水合问题
 * 通过在客户端渲染时移除可能导致冲突的样式元素
 */
export function NextraStyleFix() {
  useEffect(() => {
    // 处理可能存在的样式冲突
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