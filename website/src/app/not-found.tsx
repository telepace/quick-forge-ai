import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
        页面未找到
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        抱歉，您请求的页面不存在。请检查URL是否正确，或返回首页。
      </p>
      <div className="flex space-x-4">
        <Link 
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          返回首页
        </Link>
        <Link 
          href="/zh/docs"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          浏览文档
        </Link>
      </div>
    </div>
  )
} 