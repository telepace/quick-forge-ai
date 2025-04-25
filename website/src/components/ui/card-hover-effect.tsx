'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'


/**
 * A React component representing a styled card with various hover effects.
 *
 * @param {Object} props - The properties of the Card component.
 * @param {string} [props.className] - Additional class names to apply to the card.
 * @param {React.ReactNode} props.children - The content to be rendered inside the card.
 * @returns {JSX.Element} - The rendered Card component.
 *
 * @example
 * <Card className="custom-class">
 *   Content goes here...
 * </Card>
 */
export const Card = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'relative rounded-2xl h-full w-full p-4 overflow-hidden',
        'border duration-200',
        'bg-neutral-50 dark:bg-neutral-800',
        'border-neutral-200/[0.5] dark:border-white/[0.1]',
        'group-hover:border-neutral-300/[0.6] dark:group-hover:border-primary/[0.8]',
        className,
      )}
    >
      <div className="relative">
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

/**
 * A component to render an icon within a styled card.
 *
 * @param {Object} props - The properties for the CardIcon component.
 * @param {string} [props.className] - Additional CSS classes to apply to the card icon container.
 * @param {React.ReactNode} [props.children] - Content to be rendered inside the card icon.
 */
export const CardIcon = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div className={cn(
      'flex justify-center items-center',
      'rounded-[6px]',
      'text-zinc-600 dark:text-zinc-200',
      'size-[48px] mb-[20px] bg-red-200',
      'text-[24px]',
      'bg-[#e3e3e5] dark:bg-[#1e1e20]',
      'transition-all duration-300 dark:group-hover:text-primary',
      className,
    )}
    >
      {children}
    </div>
  )
}
/**
 * A React component that renders a card title with optional custom class names and children content.
 *
 * @param {Object} props - The properties for the CardTitle component.
 * @param {string} [props.className] - An additional CSS class name to apply to the h4 element.
 * @param {React.ReactNode} props.children - The content to be rendered inside the h4 element, typically text or other React components.
 *
 * @returns {JSX.Element} - A JSX Element representing the card title.
 *
 * @example
 * <CardTitle className="custom-class">This is a card title</CardTitle>
 */
export const CardTitle = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <h4 className={cn(
      'text-zinc-600 dark:text-zinc-200',
      'font-bold tracking-wide mt-4',
      className,
    )}
    >
      {children}
    </h4>
  )
}

/**
 * A component that displays a description with styled typography.
 *
 * @param {Object} props - The properties of the component.
 * @param {string} [props.className] - Additional class names to apply to the element. Useful for adding custom styles or classes from styling libraries.
 * @param {React.ReactNode} props.children - The content to be displayed inside the description. This can include text, other components, or any valid React node.
 *
 * @returns {JSX.Element} - The rendered CardDescription component.
 *
 * @example
 * <CardDescription className="custom-class" children="This is a description." />
 */
export const CardDescription = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <p
      className={cn(
        'mt-8 tracking-wide leading-relaxed text-sm',
        'text-zinc-500 dark:text-zinc-300/[0.8]',
        className,
      )}
    >
      {children}
    </p>
  )
}

/**
 * A React component that applies hover effects to a list of items.
 *
 * @param {Object} props - The props object.
 * @param {Array<Object>} props.items - An array of objects representing the items. Each item should have properties for title, description, optional link, and an icon.
 * @param {string} [props.className] - Optional CSS class name to apply additional styling to the container.
 * @returns {JSX.Element} The JSX element representing the hover effect component.
 *
 * @example
 * <HoverEffect items={[
 *   {
 *     title: 'Item 1',
 *     description: 'Description for Item 1',
 *     icon: <Icon />,
 *   },
 *   {
 *     title: 'Item 2',
 *     description: 'Description for Item 2',
 *     link: 'https://example.com/item2',
 *     icon: <Icon />,
 *   }
 * ]} className="custom-class" />
 *
 * @throws {Error} If items is not provided or is an empty array.
 */
export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string
    description: string
    link?: string
    icon: ReactNode
  }[]
  className?: string
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-[10px]',
        className,
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="z-[-1] absolute inset-0 h-full w-full bg-neutral-200/[0.3] dark:bg-neutral-500/[0.5] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.5 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.3, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardIcon>{item.icon}</CardIcon>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  )
}
