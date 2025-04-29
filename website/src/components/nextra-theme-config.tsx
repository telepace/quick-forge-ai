import React from 'react'
import { useRouter } from 'next/navigation'
import type { NextraThemeLayoutProps } from 'nextra'

// 自定义导航配置
const config = {
  // 禁用自动生成的导航链接，使用我们自己的导航
  sidebar: {
    defaultMenuCollapseLevel: 1,
    titleComponent: ({ title, type }: { title: string, type?: string }) => {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    }
  },
  // 禁用动态路径的导航链接
  navigation: false,
  // 禁用搜索
  search: {
    component: () => null
  },
  // 使用静态路径模式
  unstable_faviconGlyph: '📘',
}

export default config 