'use client'

import type { I18nLangAsyncProps } from '@/i18n'
import { useLocale } from '@/hooks'
import { Banner } from 'nextra/components'

const repo = 'https://github.com/telepace/quick-forge-ai'

/**
 * Renders a custom banner component with localized text and an external link.
 *
 * @param {Object} props - The component's properties.
 * @param {string} props.lang - The language code for localization.
 *
 * @returns {JSX.Element} A JSX element representing the custom banner.
 */
export function CustomBanner({ lang }: { lang: string }) {
  const { t } = useLocale()
  
  return (
    <Banner storageKey="starter-banner">
      <div className="flex justify-center items-center gap-1 nextra-banner">
        { t('banner.title') }
        {' '}
        <a
          className="max-sm:hidden hover:underline"
          target="_blank"
          href={repo}
        >
          { t('banner.more') }
        </a>
      </div>
      <style jsx>{`
        .nextra-banner {
          background: linear-gradient(to right, #8028b8, #5973e7, #37a9e1);
          color: white;
        }
      `}</style>
    </Banner>
  )
} 