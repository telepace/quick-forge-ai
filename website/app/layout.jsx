import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import { getPageMap } from 'nextra/page-map'
import { Banner } from 'nextra/components'
 
export const metadata = {
  title: 'Quick Forge AI',
  description: 'Documentation site built with Nextra'
}
 
const banner = <Banner storageKey="quick-forge-banner">Quick Forge AI Documentation</Banner>
const navbar = (
  <Navbar
    logo={<b>Quick Forge AI</b>}
  />
)
const footer = <Footer>MIT {new Date().getFullYear()} © Quick Forge AI.</Footer>
 
export default async function RootLayout({ children }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/user/quick-forge-ai"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}