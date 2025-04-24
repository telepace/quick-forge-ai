'use client'

import Link from 'next/link'

export default function BlogIndexPage() {
  const featuredPosts = [
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

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">博客</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          探索我们的技术文章、教程和最佳实践指南，帮助你更好地使用 Quick Forge AI
        </p>
        <Link href="/blog/posts" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          浏览所有文章
        </Link>
      </div>

      {/* Featured Posts */}
      <div>
        <h2 className="text-3xl font-bold mb-8">精选文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <div key={index} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <Link href={post.href} className="text-blue-600 hover:underline">
                  阅读更多 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 