'use client'

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-8">Page Not Found</h2>
      <p className="mb-8">The page you are visiting may have been moved or deleted</p>
      <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Return Home
      </a>
    </div>
  )
} 