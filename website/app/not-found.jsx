'use client'

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-8">页面不存在</h2>
      <p className="mb-8">您访问的页面可能已被移动或删除</p>
      <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        返回首页
      </a>
    </div>
  )
} 