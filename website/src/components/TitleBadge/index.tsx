'use client'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'

interface Props {
  className?: string
  children?: ReactNode
}

/**
 * A component that renders a title badge with animated background gradient.
 *
 * @param {Object} props - The properties for the TitleBadge component.
 * @param {string} [props.className=''] - Additional class names to apply to the badge.
 * @param {React.ReactNode} [props.children='NEW'] - The content of the badge. Default is 'NEW'.
 *
 * @returns {JSX.Element} - The rendered TitleBadge component.
 *
 * @example
 * <TitleBadge className="custom-class" children="Special Offer" />
 */
export const TitleBadge = ({
  className,
  children = 'NEW',
}: Props) => {
  return (
    <motion.span
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className={clsx(
        'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
        'bg-[length:200%_100%]',
        'ml-[6px] py-[4px] px-[4.5px]',
        'font-semibold text-[11px] rounded-[6px]',
        'text-white',
        'leading-[1]',
        className,
      )}
    >
      {children}
    </motion.span>
  )
}
