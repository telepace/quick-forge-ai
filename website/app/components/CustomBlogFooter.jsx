"use client"

import { Footer } from 'nextra-theme-blog'

export default function CustomBlogFooter() {
  return (
    <Footer>
      <div className="footer-content">
        <div>
          <p>MIT {new Date().getFullYear()} © Quick Forge AI</p>
        </div>
        <div className="footer-links">
          <a href="/">首页</a>
          <a href="/docs">文档</a>
          <a href="/blog">博客</a>
        </div>
      </div>
      <style jsx>{`
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .footer-links {
          display: flex;
          gap: 20px;
        }
        .footer-links a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-links a:hover {
          color: #5F2EEA;
        }
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </Footer>
  )
} 