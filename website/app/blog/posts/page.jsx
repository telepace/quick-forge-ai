'use client'

import { useState } from 'react'

export default function BlogPostsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const posts = [
    {
      title: 'Getting Started with Quick Forge AI',
      description: 'How to build your first AI application with Quick Forge AI',
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

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">All Articles</h1>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="mb-4">{post.description}</p>
              <a href={post.href} className="text-blue-600 hover:underline">Read More →</a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No matching articles found</p>
      )}
    </div>
  )
} 