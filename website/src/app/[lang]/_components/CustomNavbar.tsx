'use client'

import { useLocale } from '@/hooks'
import LocaleToggle from '@/widgets/locale-toggle'
import ThemeToggle from '@/widgets/theme-toggle'
import { Navbar } from 'nextra-theme-docs'

const repo = 'https://github.com/telepace/quick-forge-ai'

export function CustomNavbar({ lang }: { lang: string }) {
  const { t } = useLocale()
  
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