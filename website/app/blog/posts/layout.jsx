'use client'

/**
 * A functional component that wraps blog posts with a layout class.
 *
 * @param {Object} props - The properties for the BlogPostsLayout component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the blog posts layout.
 * @returns {JSX.Element} - The JSX element representing the blog posts layout with its children.
 *
 * @example
 * <BlogPostsLayout>
 *   <h1>My Blog Post</h1>
 *   <p>This is the content of my blog post.</p>
 * </BlogPostsLayout>
 */
export default function BlogPostsLayout({ children }) {
  return (
    <div className="blog-posts-layout">
      {children}
    </div>
  )
} 