import { useMDXComponents as getBlogMDXComponents } from 'nextra-theme-blog'

const blogComponents = getBlogMDXComponents()

export function useMDXComponents(components) {
  return {
    ...blogComponents,
    ...components
    // 这里可以添加您的自定义组件
  }
} 