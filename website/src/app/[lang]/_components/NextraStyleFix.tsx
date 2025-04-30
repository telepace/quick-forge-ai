'use client'

import { useEffect } from 'react'

/**
 * This function is used to fix the Nextra style hydration issue.
 * It achieves this by removing style elements that may cause conflicts during client-side rendering.
 *
 * @returns {null} - This function does not return any value, always returns null.
 */
export function NextraStyleFix() {
  useEffect(() => {
    // Handle potential style conflicts
    /**
     * Handles the removal of specific style tags from the document.
     *
     * This function searches for all `<style>` elements in the document and removes those
     * that contain either 'body {transition:' or 'body[unresolved]' in their text content.
     */
    const handleStyleFix = () => {
      // Find and remove style tags containing body transition
      document.querySelectorAll('style').forEach(styleEl => {
        if (styleEl.textContent?.includes('body {transition:') || 
            styleEl.textContent?.includes('body[unresolved]')) {
          styleEl.remove()
        }
      })
    }
    
    // Execute cleanup
    handleStyleFix()
    
    // For dynamically loaded styles, an observer can be set
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          handleStyleFix()
        }
      })
    })
    
    observer.observe(document.head, { 
      childList: true,
      subtree: true 
    })
    
    return () => observer.disconnect()
  }, [])
  
  return null
}

/**
 * A React functional component that wraps content with specific styling and layout for documentation purposes.
 *
 * @param {React.ReactNode} children - The child components or elements to be rendered within the wrapper.
 * @param {any} [toc] - An optional table of contents data, which can be used to render a sidebar or other navigational elements.
 * @param {any} [metadata] - Optional metadata related to the content, which could include author information, creation date, etc.
 *
 * @returns {JSX.Element} A JSX element representing the styled and laid-out content container.
 */
export const NextraContentWrapper: React.FC<{
  children: React.ReactNode,
  toc?: any,
  metadata?: any
}> = ({ children, toc, metadata }) => {
  const { theme } = useTheme()

  return (
    <div className="nextra-content-container nx-mx-auto nx-max-w-[90rem]">
      <article className="nextra-content nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-w-full nx-px-6 nx-pb-8 md:nx-pl-[max(env(safe-area-inset-left),1.5rem)] md:nx-pr-[max(env(safe-area-inset-right),1.5rem)]">
        <main className="nextra-body nx-w-full nx-break-words">
          {children}
        </main>
      </article>
    </div>
  )
} 