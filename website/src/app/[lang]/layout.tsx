import type { I18nLangKeys } from '@/i18n'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import { ThemeProvider } from './_components/ThemeProvider'
import './styles/index.css'

export const metadata = {
  metadataBase: new URL('https://nextjs-nextra-starter-green.vercel.app'),
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', url: '/img/favicon.svg', type: 'image/svg+xml' }
  ],
} satisfies Metadata

interface Props {
  children: ReactNode
  params: Promise<{ lang: I18nLangKeys }>
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params
  await getDictionary(lang)

  return (
    <html
      lang={lang}
      dir={getDirection(lang)}
      suppressHydrationWarning
    >
      <head />
      <body suppressHydrationWarning>
        <ThemeProvider>
          <div className="nextra-container main">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
