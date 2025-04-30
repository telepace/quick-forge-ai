'use client'

import styles from '@/components/HomepageHero/SetupHero.module.css'
import { MotionWrapperFlash } from '@/components/MotionWrapper/Flash'
import { Button } from '@/components/ui/button'
import { FlipWords } from '@/components/ui/flip-words'
import { LinkPreview } from '@/components/ui/link-preview'
import { useLocale } from '@/hooks'
import clsx from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'

interface Props {
}
/**
 * Renders the hero section of the application with various UI components.
 *
 * @param {Props} props - The properties passed to the component.
 * @returns {JSX.Element} - A JSX element representing the hero section.
 */
export function SetupHero(props: Props) {
  const { t, currentLocale } = useLocale()
  const { lang } = useParams() as { lang: string }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.badgeContainer}>
          <a
            className={styles.badge}
            href="https://github.com/telepace/quick-forge-ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('badgeTitle')}
          </a>
        </div>
        <h1 className={styles.headline}>
          <MotionWrapperFlash
            disabledAnimation={false}
            className="flex items-center"
          >
            <span className="icon-[emojione-v1--lightning-mood]"></span>
          </MotionWrapperFlash>
          {' '}
          Nextra
          {' '}
          <br className="sm:hidden"></br>
          {' '}
          Starter
          <br className="sm:hidden"></br>
          {' '}
          Template
        </h1>

        <Link
          href={`/${currentLocale}/upgrade`}
          className={clsx([
            'bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-lg',
            'dark:bg-linear-to-r dark:from-green-400 dark:via-teal-500 dark:to-cyan-500 dark:text-white',
            'text-sm mt-2 inline-block px-3 py-1 rounded-lg',
            '[&>span]:font-bold',
            'animate-pulse',
            '[animation-duration:2s]',
          ])}
          dangerouslySetInnerHTML={{
            __html: t('featureSupport', {
              feature: `<span>Tailwind CSS v4, Nextra v4</span>`,
            }),
          }}
        />


        <div className={clsx([
          styles.subtitle,
          'text-neutral-500 dark:text-neutral-300',
        ])}
        >
          Template made
          {' '}
          <FlipWords
            words={[
              'Fast',
              'Simple',
              'Modern',
              'Flexible',
              'Easy',
              'Functional',
              'Efficient',
              'Scalable',
              'Reusable',
            ]}
          />
          <br />
          With
          {' '}
          <LinkPreview
            url="https://nextjs.org"
          >
            Next.js
          </LinkPreview>
          ,
          {' '}
          <LinkPreview
            url="https://tailwindcss.com"
          >
            Tailwind CSS
          </LinkPreview>
          , and
          {' '}
          <LinkPreview
            url="https://ui.shadcn.com"
          >
            Shadcn UI
          </LinkPreview>
          {', '}
          <LinkPreview
            url="https://ui.aceternity.com"
          >
            Aceternity UI
          </LinkPreview>
        </div>
        <div className="flex justify-center pt-10">
          <div className="max-w-[500px] flex flex-wrap gap-[20px] max-sm:justify-center">
            <Button
              asChild
              size="lg"
              className="font-bold group max-sm:w-[100%]"
            >
              <Link
                href={`/${currentLocale}/introduction`}
              >
                {t('getStarted')}
                <span className="w-[20px] translate-x-[6px] transition-all group-hover:translate-x-[10px] icon-[mingcute--arrow-right-fill]"></span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="font-bold group max-sm:w-[100%]"
            >
              <Link
                href="https://github.com/telepace/quick-forge-ai"
                target="_blank"
              >
                Github
                <span className="ml-[6px] icon-[mingcute--github-line]"></span>
              </Link>
            </Button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 0.3
              }}
              className="max-sm:w-[100%]"
            >
              <Link href={`/${lang}/blog`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold group relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:text-white dark:from-blue-600 dark:to-purple-700"
                >
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 dark:from-blue-400 dark:to-purple-500"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.7 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center">
                    {lang === 'zh' ? '博客' : 'Blog'}
                    <motion.span 
                      className="ml-[6px] icon-[mingcute--quill-pen-line]"
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
