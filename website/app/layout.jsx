import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
// Import theme styles
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'Quick Forge AI',
  description: 'Quick Forge AI Documentation'
}

export default async function RootLayout({ children }) {
  const banner = <Banner storageKey="nextra-banner">Welcome to Quick Forge AI Documentation</Banner>
  const navbar = <Navbar logo={<strong>Quick Forge AI</strong>} />
  const footer = (
    <Footer>
      MIT {new Date().getFullYear()} © Quick Forge AI
    </Footer>
  )

  return (
    <html
      lang="en-US"
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