import type { I18nLangAsyncProps, I18nLangKeys } from '@/i18n'

import type { Metadata } from 'next'

import type { ReactNode } from 'react'
import { CustomFooter } from '@/components/CustomFooter'

import { useServerLocale } from '@/hooks'
import LocaleToggle from '@/widgets/locale-toggle'
import ThemeToggle from '@/widgets/theme-toggle'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import { Footer, LastUpdated, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'

import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import { ThemeProvider } from './_components/ThemeProvider'
import './styles/index.css'

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  metadataBase: new URL('https://nextjs-nextra-starter-green.vercel.app'),
  icons: '/img/favicon.svg',
} satisfies Metadata

const repo = 'https://github.com/pdsuwwz/nextjs-nextra-starter'

/**
 * Renders a custom banner component with localized text.
 *
 * @async
 * @function CustomBanner
 * @param {I18nLangAsyncProps} props - The properties for the CustomBanner component.
 * @returns {JSX.Element} A React JSX element representing the custom banner.
 * @throws {Error} If an error occurs during server locale loading or rendering.
 *
 * @example
 * <CustomBanner lang="en" />
 */
const CustomBanner = async ({ lang }: I18nLangAsyncProps) => {
  const { t } = await useServerLocale(lang)
  return (
    <Banner
      storageKey="starter-banner"
    >
      <div className="flex justify-center items-center gap-1">
        { t('banner.title') }
        {' '}
        <a
          className="max-sm:hidden text-warning hover:underline"
          target="_blank"
          href={repo}
        >
          { t('banner.more') }
        </a>
      </div>
    </Banner>
  )
}


/** @async
 * A React component representing a custom navigation bar with locale and theme toggles.
 *
 * @param {I18nLangAsyncProps} lang - The language object containing the current language setting.
 * @returns {JSX.Element} - The rendered JSX for the CustomNavbar component.
 *
 * @example
 * <CustomNavbar lang={currentLanguage} />
 */
const CustomNavbar = async ({ lang }: I18nLangAsyncProps) => {
  const { t } = await useServerLocale(lang)
  return (
    <Navbar
      logo={(
        <span>{ t('systemTitle') }</span>
      )}
      logoLink={`/${lang}`}
      projectLink={repo}
    >
      <>
        <LocaleToggle className="max-md:hidden" />
        <ThemeToggle className="max-md:hidden" />
      </>

    </Navbar>
  )
}

/**
 * Renders a script tag to track user behavior using Baidu Analytics.
 *
 * @returns {JSX.Element} A React component that includes a script tag for Baidu tracking.
 */
const BaiduTrack = () => {
  return (
    <>
      <Script strategy="afterInteractive">
        {`
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?d5ad5e04e6af914c01767926567602be";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();
        `}
      </Script>
    </>
  )
}


interface Props {
  children: ReactNode
  params: Promise<{ lang: I18nLangKeys }>
}

/**
 * The root layout component for the application.
 *
 * @async
 * @function RootLayout
 * @param {Object} props - The props object containing children and params.
 * @param {React.ReactNode} props.children - The child components to render inside the layout.
 * @param {Object} props.params - The parameters passed to the component, including the language.
 * @param {string} props.params.lang - The current language code.
 *
 * @returns {JSX.Element} - The rendered JSX element for the root layout.
 *
 * @throws {Error} - If an error occurs while fetching dictionary or page map data.
 *
 * @example
 * <RootLayout children={<div>Welcome to My Nextra Starter</div>} params={{ lang: 'en' }} />
 */
export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const pageMap = await getPageMap(lang)

  const title = 'My Nextra Starter'
  const description = 'A Starter template with Next.js, Nextra'

  const { t } = await useServerLocale(lang)

  return (
    <html
      // Not required, but good for SEO
      lang={lang}
      // Required to be set
      // dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      dir={getDirection(lang)}
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* <title>{asPath !== '/' ? `${normalizePagesResult.title} - ${title}` : title}</title> */}
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <link rel="canonical" href={repo} />
      </Head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          storageKey="starter-theme-provider"
          disableTransitionOnChange
        >
          <Layout
            banner={
              <CustomBanner lang={lang} />
            }
            navbar={
              <CustomNavbar lang={lang} />
            }
            lastUpdated={(
              <LastUpdated>
                { t('lastUpdated') }
              </LastUpdated>
            )}
            editLink={null}
            docsRepositoryBase="https://github.com/pdsuwwz/nextjs-nextra-starter"
            footer={(
              <Footer className="bg-background py-5!">
                <CustomFooter />
              </Footer>
            )}
            search={<Search />}
            i18n={[
              { locale: 'en', name: 'English' },
              { locale: 'zh', name: '简体中文' },
            ]}
            pageMap={pageMap}
            feedback={{ content: '' }}
          // ... Your additional layout options
          >
            {children}
          </Layout>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-VCR6017LB8" />
      <BaiduTrack />
    </html>
  )
}
