'use client'

import { useLocale } from '@/hooks'
import LocaleToggle from '@/widgets/locale-toggle'
import ThemeToggle from '@/widgets/theme-toggle'
import { Navbar } from 'nextra-theme-docs'

const repo = 'https://github.com/telepace/quick-forge-ai'

/**
 * Represents a custom navigation bar component that utilizes localization and theme toggles.
 *
 * @param {Object} props - The properties for the CustomNavbar component.
 * @param {string} props.lang - The language code used to determine the link for the logo.
 *
 * @returns {JSX.Element} A React JSX element representing the navigation bar.
 */
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