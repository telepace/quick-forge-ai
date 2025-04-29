import type { MetaRecord } from 'nextra'
import { TitleBadge } from '@/components/TitleBadge'

export default {
  index: {
    title: 'Home',
    display: 'hidden',
    theme: {
      timestamp: false,
      layout: 'full',
      toc: false,
    },
  },
  introduction: {
    title: 'This is Introduction',
    theme: {
      navbar: true,
      toc: false,
    },
  },
  blog: {
    title: '📝 Blog',
  },
  docs: {
    title: '📦 Some Examples',
  },
  upgrade: {
    title: (
      <span className="flex items-center leading-[1]">
        What's New
        <TitleBadge />
      </span>
    ),
  },
} satisfies MetaRecord
