'use client'

import { cn } from '@/lib/utils'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

import * as React from 'react'

const Accordion = AccordionPrimitive.Root

const AccordionItem = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) => {
  const itemRef = React.useRef<React.ComponentRef<typeof AccordionPrimitive.Item>>(null)

  return (
    <AccordionPrimitive.Item
      ref={itemRef}
      className={cn(
        'border-b',
        className,
      )}
      {...props}
    />
  )
}
AccordionItem.displayName = 'AccordionItem'

/**
 * A component used as a trigger for an accordion item. It handles the interactive behavior of expanding or collapsing the accordion section.
 *
 * @param {Object} props - The properties passed to the AccordionTrigger component.
 * @param {string} [props.className] - Additional class names to be added to the root element.
 * @param {React.ReactNode} props.children - The content inside the trigger, typically a label or text.
 * @returns {JSX.Element} - The rendered AccordionTrigger component.
 *
 * @example
 * <AccordionTrigger className="my-2" onClick={() => console.log('Accordion clicked')}>
 *   Click me to toggle accordion
 * </AccordionTrigger>
 */
const AccordionTrigger = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) => {
  const itemRef = React.useRef<React.ComponentRef<typeof AccordionPrimitive.Trigger>>(null)
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={itemRef}
        className={cn(
          'flex flex-1 items-center justify-between py-7 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
          'text-[18px] font-bold',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

/**
 * A component that represents the content of an accordion item. This component wraps its children with additional styling and animation effects.
 *
 * @param {Object} props - The properties for the AccordionContent component.
 * @property {string} [className] - Additional CSS classes to apply to the accordion content.
 * @property {React.ReactNode} children - The child elements to be rendered within the accordion content.
 * @returns {JSX.Element} The JSX element representing the accordion content.
 *
 * @example
 * <AccordionContent className="custom-content">
 *   <p>Content goes here...</p>
 * </AccordionContent>
 */
const AccordionContent = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) => {
  const itemRef = React.useRef<React.ComponentRef<typeof AccordionPrimitive.Content>>(null)

  return (
    <AccordionPrimitive.Content
      ref={itemRef}
      className={cn(
        'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        'text-[16px]',
      )}
      {...props}
    >
      <div className={cn('pb-6 pt-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
