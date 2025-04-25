'use client'

import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva } from 'class-variance-authority'

import * as React from 'react'

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

/**
 * A custom toggle component using React and Tailwind CSS utilities.
 *
 * @param {Object} props - The properties for the Toggle component.
 * @property {string} [className] - Additional classes to apply to the toggle root element.
 * @property {string} [variant] - The variant of the toggle (e.g., "primary", "secondary").
 * @property {string} [size] - The size of the toggle (e.g., "sm", "md").
 * @returns {JSX.Element} - The rendered Toggle component.
 *
 * @example
 * <Toggle variant="primary" size="md" className="my-toggle-class">
 *   Click me!
 * </Toggle>
 */
const Toggle = ({
  className,
  variant,
  size,
  ...props
}: React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) => {
  const itemRef = React.useRef<React.ComponentRef<typeof TogglePrimitive.Root>>(null)

  return (
    <TogglePrimitive.Root
      ref={itemRef}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
