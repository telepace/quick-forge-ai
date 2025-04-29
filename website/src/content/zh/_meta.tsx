import type { MetaRecord } from 'nextra'
import { TitleBadge } from '@/components/TitleBadge'

export default {
  index: {
    title: '首页',
    display: 'hidden',
    theme: {
      timestamp: false,
      layout: 'full',
      toc: false,
    },
  },
  introduction: {
    title: '介绍',
    theme: {
      navbar: true,
      toc: false,
    },
  },
  blog: {
    title: '📝 博客',
  },
  docs: {
    title: '📦 示例代码',
  },
  upgrade: {
    title: (
      <span className="flex items-center leading-[1]">
        新变化
        <TitleBadge />
      </span>
    ),
  },
} satisfies MetaRecord
