import type { ReactNode } from 'react'
import { MotionWrapperFadeIn, MotionWrapperFlash } from '@/components/MotionWrapper'
import { cn } from '@/lib/utils'

interface Props {
  title?: string
  titleProps?: Partial<React.ComponentProps<typeof MotionWrapperFlash>>
  description?: string
  children?: ReactNode
  className?: string
  tallPaddingY?: boolean
}

/**
 * A React component that renders a section with a title, description, and children content.
 *
 * @param {Object} props - The properties for the Section component.
 * @param {string} [props.className] - Additional CSS classes to apply to the section.
 * @param {Object} [props.titleProps] - Properties to pass to the MotionWrapperFlash component for the title.
 * @param {string} [props.title] - The title text of the section.
 * @param {string} [props.description] - An optional description text for the section.
 * @param {React.ReactNode} [props.children] - Content to be rendered within the section.
 * @param {boolean} [tallPaddingY=false] - If true, adds additional padding to the top and bottom of the title.
 * @returns {React.ReactElement} The rendered Section component.
 *
 * @example
 * <Section title="Welcome" description="This is a welcome message." tallPaddingY={true}>
 *   <p>Main content goes here.</p>
 * </Section>
 */
export const Section = (props: Props) => {
  const {
    className,
    titleProps,
    title,
    description,
    children,
    tallPaddingY = false,
  } = props
  return (
    <section className={cn(
      'flex flex-col items-center justify-center px-6',
      className,
    )}
    >
      <MotionWrapperFlash
        {
          ...titleProps
        }
      >
        <h2 className={cn(
          'relative',
          'text-center font-semibold',
          'bg-clip-text text-transparent bg-linear-to-b',
          'text-3xl md:text-5xl md:leading-tight pt-4',
          'from-neutral-700 to-black',
          'dark:from-neutral-800 dark:to-white',
          `${tallPaddingY ? 'pt-20 pb-10' : ''}`,
        )}
        >
          <span>{ title }</span>
        </h2>
      </MotionWrapperFlash>
      <MotionWrapperFadeIn>
        {
          description
          && (
            <h2 className="text-sm md:text-base max-w-4xl my-4 mx-auto text-center font-normal text-zinc-600 dark:text-zinc-400">
              { description }
            </h2>
          )
        }
      </MotionWrapperFadeIn>
      {children}
    </section>
  )
}
