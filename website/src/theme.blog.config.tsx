import React from 'react'
import type { NextraBlogTheme } from 'nextra-theme-blog'

const themeConfig: Partial<NextraBlogTheme> = {
  footer: (
    <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
      <p className="text-center text-sm">
        © {new Date().getFullYear()} Quick Forge AI. All rights reserved.
      </p>
    </div>
  ),
  head: ({ title, meta }: { title: string, meta: Record<string, any> }) => {
    return (
      <>
        {meta.description && (
          <meta name="description" content={meta.description} />
        )}
        {meta.tag && <meta name="keywords" content={meta.tag} />}
        {meta.author && <meta name="author" content={meta.author} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@quickforgeai" />
        <meta property="og:title" content={title} />
        {meta.description && (
          <meta property="og:description" content={meta.description} />
        )}
        <meta property="og:site_name" content="Quick Forge AI" />
      </>
    )
  },
  readMore: '阅读更多 →',
  postFooter: (
    <div className="mt-8">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        感谢阅读我们的博客文章。如有问题或建议，请随时联系我们。
      </p>
    </div>
  ),
  darkMode: true,
}

export default themeConfig 