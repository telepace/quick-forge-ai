import React from 'react'

export default {
  logo: <strong>Quick Forge AI</strong>,
  project: {
    link: 'https://github.com/quick-forge-ai',
  },
  docsRepositoryBase: 'https://github.com/quick-forge-ai',
  footer: {
    text: `MIT ${new Date().getFullYear()} © Quick Forge AI`,
  },
  nextThemes: {
    defaultTheme: 'system',
  },
  banner: {
    key: 'nextra-banner',
    text: '欢迎使用 Quick Forge AI 文档',
  },
  head: () => {
    return (
      <>
        <meta name="description" content="Quick Forge AI Documentation" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </>
    )
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Quick Forge AI'
    }
  },
  search: {
    placeholder: '搜索文档...'
  },
  sidebar: {
    defaultMenuCollapseLevel: 1
  }
} 