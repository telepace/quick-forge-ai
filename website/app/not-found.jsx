'use client'

/**
 * Renders a 404 error page indicating that the requested page does not exist.
 *
 * @return {JSX.Element} - The JSX element representing the 404 error page.
 *
 * Example Usage:
 * ```jsx
 * import NotFound from './NotFound';
 *
 * function App() {
 *   return (
 *     <div>
 *       <NotFound />
 *     </div>
 *   );
 * }
 * ```
 */
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