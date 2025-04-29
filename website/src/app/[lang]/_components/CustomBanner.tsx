'use client'

import type { I18nLangAsyncProps } from '@/i18n'
import { useLocale } from '@/hooks'
import { Banner } from 'nextra/components'

const repo = 'https://github.com/telepace/quick-forge-ai'

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