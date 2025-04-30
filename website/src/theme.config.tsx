import React from 'react'
import { useParams } from 'next/navigation'
import NextraLink from './components/NextraLink'

// Complete Nextra theme configuration
const config = {
  // Customize to use our link component
  components: {
    a: NextraLink
  },
  // Configure project information
  docsRepositoryBase: 'https://github.com/telepace/quick-forge-ai',
  // Handle metadata in the Head tag
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Quick Forge AI'
    }
  },
  // Preferred icon
  faviconGlyph: '📘',
  // Important: Handle dynamic route links, avoiding [lang] format links
  logo: () => {
    const params = useParams()
    const lang = params?.lang || 'zh'
    
    return (
      <span className="font-bold text-xl">
        Quick Forge AI
      </span>
    )
  },
  // Search function configuration
  search: {
    placeholder: 'Search documents...'
  },
  // Footer configuration
  footer: {
    text: `© ${new Date().getFullYear()} Quick Forge AI - Built with Nextra`
  }
}

export default config 