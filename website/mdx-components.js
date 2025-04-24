import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'

// 获取默认的MDX组件
const themeComponents = getThemeComponents()

// 合并组件
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...components,
  }
} 