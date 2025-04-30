'use client'

import Link from 'next/link'
import { ReactNode, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'

interface NextraLinkProps {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
  [key: string]: any
}

/**
 * 自定义链接组件，用于解决Nextra中动态路由的问题。
 * 这个组件会检测动态路由格式并使用正确的链接形式。
 *
 * @param {NextraLinkProps} props - 组件的属性。
 * @returns {JSX.Element} 渲染后的链接元素。
 */
export default function NextraLink({ href, children, ...props }: NextraLinkProps) {
  const params = useParams()
  const { lang } = params
  
  // 处理函数，替换[lang]为实际语言值并规范化路径
  const processedHref = useMemo(() => {
    if (!href) return href
    
    // 如果链接是外部链接或锚点，直接使用原始链接
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
      return href
    }
    
    // 替换[lang]为实际的语言
    let path = href
    if (path.includes('[lang]') && lang) {
      path = path.replace(/\[lang\]/g, lang as string)
    }
    
    // 特殊情况处理 - 避免/home路径
    if (path === `/${lang}/home`) {
      return `/${lang}`
    }
    
    // 移除路径末尾的斜杠(如果存在)
    if (path.endsWith('/') && path.length > 1) {
      path = path.slice(0, -1)
    }
    
    // 检测是否还有其他动态路径参数
    const hasDynamicSegments = /\[.*?\]/.test(path)
    
    if (hasDynamicSegments) {
      // 仍有动态段，返回对象形式
      return { pathname: path }
    }
    
    // 普通路径，直接返回字符串
    return path
  }, [href, lang])
  
  // 如果是外部链接，使用常规<a>标签
  if (typeof processedHref === 'string' && (
    !processedHref || 
    processedHref.startsWith('http') || 
    processedHref.startsWith('#') || 
    processedHref.startsWith('mailto:')
  )) {
    return (
      <a href={processedHref} {...props}>{children}</a>
    )
  }
  
  // 否则使用Next.js的Link组件
  return (
    <Link href={processedHref} {...props}>
      {children}
    </Link>
  )
} 