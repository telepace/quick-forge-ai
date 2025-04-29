import React from 'react'
import { useParams } from 'next/navigation'
import NextraLink from './components/NextraLink'

// 完整的Nextra主题配置
const config = {
  // 自定义使用我们的链接组件
  components: {
    a: NextraLink
  },
  // 配置项目信息  
  docsRepositoryBase: 'https://github.com/telepace/quick-forge-ai',
  // 处理Head标签中的元信息
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Quick Forge AI'
    }
  },
  // 首选项图标
  faviconGlyph: '📘',
  // 重要：处理动态路由链接，避免[lang]格式的链接
  logo: () => {
    const params = useParams()
    const lang = params?.lang || 'zh'
    
    return (
      <span className="font-bold text-xl">
        Quick Forge AI
      </span>
    )
  },
  // 搜索功能配置
  search: {
    placeholder: '搜索文档...'
  },
  // 页脚配置
  footer: {
    text: `© ${new Date().getFullYear()} Quick Forge AI - 使用Nextra构建`
  }
}

export default config 