'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import React from 'react'

interface Props {
  className?: string
  disabledAnimation?: boolean
  disabledHover?: boolean
  children: ReactNode
}

/**
 * A React component that wraps its children with animated motion effects. The animation includes initial state, hover state, and transition properties.
 *
 * @param {Object} props - The props for the MotionWrapperFlash component.
 * @param {boolean} [props.disabledAnimation=true] - Determines whether to disable the animation effect.
 * @param {boolean} [props.disabledHover=false] - Determines whether to disable the hover animation effect.
 * @param {React.ReactNode} props.children - The children elements to be animated.
 * @param {string} [props.className=''] - Additional classes to apply to the motion span.
 *
 * @returns {JSX.Element} - Returns a JSX element that renders the wrapped children with applied animation effects.
 *
 * @example
 * <MotionWrapperFlash disabledAnimation={false}>
 *   <button>Click me</button>
 * </MotionWrapperFlash>
 */
export const MotionWrapperFlash: React.FC<Props> = (props) => {
  const {
    disabledAnimation = true,
    disabledHover = false,
    children,
    className,
  } = props

  if (disabledAnimation) {
    return children
  }

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}

      whileHover={
        !disabledHover
          ? {
              scale: 1.1,
              rotate: 10,
              transition: { duration: 0.3 },
            }
          : {}
      }
      transition={{
        duration: 0.6,
        ease: [0.2, 0.8, 0.6, 1],
        scale: {
          type: 'spring',
          stiffness: 260,
        },
        rotate: {
          type: 'spring',
          stiffness: 150,
        },
        color: {
          duration: 0.3,
        },
      }}
    >
      {children}
    </motion.span>
  )
}
