export default {
  logo: <span style={{ fontWeight: 'bold' }}>Quick Forge AI</span>,
  project: {
    link: 'https://github.com/telepace/quick-forge-ai',
  },
  docsRepositoryBase: 'https://github.com/telepace/quick-forge-ai',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Quick Forge AI'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Quick Forge AI - 快速构建 AI 应用的开源平台" />
    </>
  ),
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} © <a href="https://github.com/telepace/quick-forge-ai" target="_blank">Quick Forge AI</a>.
      </span>
    )
  },
  search: {
    placeholder: '搜索文档...'
  },
  sidebar: {
    defaultMenuCollapseLevel: 1
  }
} 