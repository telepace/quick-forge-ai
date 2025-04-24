import nextra from 'nextra'

// 创建 nextra 配置
const withNextra = nextra({
  // Nextra 4.x 不再支持 theme 和 themeConfig 选项
  defaultShowCopyCode: true,
})

// 导出最终的 Next.js 配置
export default withNextra({
  // 开启静态导出
  output: 'export',
  // 图片配置
  images: {
    unoptimized: true,
  }
})