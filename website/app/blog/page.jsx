'use client'

import Link from 'next/link'

export default function BlogIndexPage() {
  const featuredPosts = [
    {
      title: 'Getting Started with Quick Forge AI',
      description: 'How to build your first AI application using Quick Forge AI',
      href: '/blog/posts/getting-started'
    },
    {
      title: 'Best Practices',
      description: 'Best practices for improving application performance and user experience',
      href: '/blog/posts/best-practices'
    },
    {
      title: 'Tech Sharing',
      description: 'Our technical architecture and development insights',
      href: '/blog/posts/tech-sharing'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Explore our technical articles, tutorials, and best practice guides to help you better use Quick Forge AI
        </p>
        <Link href="/blog/posts" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Browse All Posts
        </Link>
      </div>

      {/* Featured Posts */}
      <div>
        <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <div key={index} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <Link href={post.href} className="text-blue-600 hover:underline">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 