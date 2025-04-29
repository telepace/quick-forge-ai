'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export interface BlogButtonProps {
  className?: string
}

/**
 * React functional component representing a blog button.
 *
 * @param {BlogButtonProps} props - The properties for the BlogButton component.
 * @param {string} [props.className=''] - Optional class name to be applied to the button.
 *
 * @returns {JSX.Element} A React JSX element representing the blog button.
 *
 * @throws {Error} If the 'lang' parameter cannot be retrieved from the URL parameters.
 */
export const BlogButton: React.FC<BlogButtonProps> = ({ className = '' }) => {
  const { lang } = useParams() as { lang: string }
  
  return (
    <Link href={`/${lang}/blog`} className={className}>
      <motion.div
        className="relative inline-flex h-14 overflow-hidden rounded-full border border-blue-500 bg-blue-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-transparent hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-blue-400 dark:bg-blue-400 dark:text-gray-900 dark:hover:bg-transparent dark:hover:text-blue-400 dark:focus:ring-blue-400"
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
      >
        <span className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
          />
        </span>
        
        <span className="relative z-10 flex items-center justify-center space-x-2">
          <motion.span
            className="icon-[uil--blogger] size-5"
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 500 }}
          />
          <span>{lang === 'zh' ? '博客' : 'Blog'}</span>
        </span>
      </motion.div>
    </Link>
  )
}

export default BlogButton 