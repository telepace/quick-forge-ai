import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
// 引入主题样式
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'Quick Forge AI',
  description: 'Quick Forge AI Documentation'
}

/**
 * Represents the root layout component of a Next.js application.
 *
 * @param {Object} props - The properties for the RootLayout component.
 * @param {React.ReactNode} props.children - The children components to be rendered inside the layout.
 * @returns {JSX.Element} - The JSX element representing the root layout.
 */
export default async function RootLayout({ children }) {
  const banner = <Banner storageKey="nextra-banner">欢迎使用 Quick Forge AI 文档</Banner>
  const navbar = <Navbar logo={<strong>Quick Forge AI</strong>} />
  const footer = (
    <Footer>
      MIT {new Date().getFullYear()} © Quick Forge AI
    </Footer>
  )

  return (
    <html
      lang="zh-CN"
      dir="ltr"
      suppressHydrationWarning
    >
      <Head />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}