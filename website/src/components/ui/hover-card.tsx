'use client'

import { cn } from '@/lib/utils'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'

import * as React from 'react'

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger


/**
 * A component that renders a hover card content with customizable alignment and styling.
 *
 * @param {Object} props - The properties for the HoverCardContent component.
 * @param {string} [props.className] - Additional CSS classes to apply to the content.
 * @param {string} [props.align='center'] - The horizontal alignment of the content. Can be 'left', 'right', or 'center'.
 * @param {number} [props.sideOffset=4] - The offset distance from the side in pixels.
 * @returns {JSX.Element} - The rendered HoverCardContent component.
 *
 * @example
 * <HoverCardContent className="custom-class" align="left" sideOffset={5}>
 *   Content here
 * </HoverCardContent>
 */
const HoverCardContent = ({ className, align = 'center', sideOffset = 4, ...props }: React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>) => {
  const itemRef = React.useRef<React.ComponentRef<typeof HoverCardPrimitive.Content>>(null)
  return (
    <HoverCardPrimitive.Content
      ref={itemRef}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  )
}
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardContent, HoverCardTrigger }
