'use client'

/**
 * A component that provides a basic layout for blog posts.
 *
 * @param {Object} props - The component's props.
 * @param {React.ReactNode} props.children - The content to be displayed within the blog layout.
 * @returns {JSX.Element} - The rendered BlogLayout component.
 */
export default function BlogLayout({ children }) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  )
} 