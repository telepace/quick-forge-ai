'use client'

import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

import * as React from 'react'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

/**
 * A component that renders an alert message with customizable styling.
 *
 * @param {React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>} props - The properties for the Alert component.
 * @returns {JSX.Element} - The rendered Alert element.
 */
const Alert = ({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) => {
  const itemRef = React.useRef<HTMLDivElement>(null)
  return (
    <div
      ref={itemRef}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}
Alert.displayName = 'Alert'

/**
 * A component that renders an alert title with customizable styles.
 *
 * @param {Object} props - The properties of the component.
 * @param {string} [props.className] - Additional classes to apply to the element.
 * @returns {React.ReactNode} - The rendered AlertTitle component.
 *
 * @example
 * <AlertTitle className="text-red-500">Important Notice</AlertTitle>
 */
const AlertTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  const itemRef = React.useRef<HTMLParagraphElement>(null)

  return (
    <h5
      ref={itemRef}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
}
AlertTitle.displayName = 'AlertTitle'

/**
 * A React component used to display an alert description within a paragraph element.
 *
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - Additional properties passed to the underlying `HTMLParagraphElement`.
 * @returns {JSX.Element} - The rendered JSX element.
 *
 * @example
 * <AlertDescription className="custom-class">
 *   This is an alert description.
 * </AlertDescription>
 */
const AlertDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  const itemRef = React.useRef<HTMLParagraphElement>(null)

  return (
    <div
      ref={itemRef}
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
}
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertDescription, AlertTitle }
