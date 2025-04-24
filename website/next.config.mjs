import nextra from 'nextra'

// 为Nextra配置
const withNextra = nextra({
  defaultShowCopyCode: true,
})

// 导出最终的Next.js配置
export default withNextra({
  output: 'standalone',
  images: {
    unoptimized: true
  }
})