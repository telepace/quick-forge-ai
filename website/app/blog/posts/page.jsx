'use client'

import { useState } from 'react'

export default function BlogPostsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const posts = [
    {
      title: '快速入门 Quick Forge AI',
      description: '如何使用 Quick Forge AI 构建你的第一个 AI 应用',
      href: '/blog/posts/getting-started'
    },
    {
      title: '最佳实践',
      description: '提高应用性能和用户体验的最佳实践',
      href: '/blog/posts/best-practices'
    },
    {
      title: '技术分享',
      description: '我们的技术架构和开发心得',
      href: '/blog/posts/tech-sharing'
    }
  ]

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">所有文章</h1>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="搜索文章..."
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
              <a href={post.href} className="text-blue-600 hover:underline">阅读更多 →</a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">没有找到匹配的文章</p>
      )}
    </div>
  )
} 