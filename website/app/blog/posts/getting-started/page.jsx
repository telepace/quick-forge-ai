'use client'

/**
 * React component for the getting started guide of Quick Forge AI.
 * @returns {React.ReactNode} - The rendered JSX element.
 */
export default function GettingStartedPost() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">快速入门 Quick Forge AI</h1>
      <p className="text-gray-500 mb-8">发布日期: 2024年4月20日</p>
      
      <div className="prose lg:prose-xl">
        <p>欢迎使用 Quick Forge AI！本文将指导你如何快速开始使用我们的平台构建你的第一个 AI 应用。</p>
        
        <h2>什么是 Quick Forge AI?</h2>
        <p>Quick Forge AI 是一个开源平台，旨在帮助开发者快速构建 AI 应用。无论你是经验丰富的开发者还是 AI 领域的新手，我们的平台都能帮助你轻松实现想法。</p>
        
        <h2>安装</h2>
        <p>首先，你需要通过 npm 安装我们的 CLI 工具：</p>
        <pre><code>npm install -g @quick-forge/cli</code></pre>
        
        <h2>创建新项目</h2>
        <p>安装完成后，你可以使用以下命令创建一个新项目：</p>
        <pre><code>quick-forge create my-ai-app</code></pre>
        
        <h2>选择模板</h2>
        <p>我们提供了多种项目模板，包括：</p>
        <ul>
          <li>聊天机器人</li>
          <li>文本生成</li>
          <li>图像识别</li>
          <li>语音助手</li>
        </ul>
        
        <h2>配置 AI 模型</h2>
        <p>在 <code>config.json</code> 文件中，你可以指定要使用的 AI 模型和参数：</p>
        <pre><code>{`{
  "model": "gpt-4",
  "temperature": 0.7,
  "max_tokens": 1000
}`}</code></pre>
        
        <h2>运行你的应用</h2>
        <p>配置完成后，运行以下命令启动你的应用：</p>
        <pre><code>cd my-ai-app
npm install
npm start</code></pre>
        
        <h2>下一步</h2>
        <p>恭喜！你已经成功创建了你的第一个 AI 应用。接下来，你可以：</p>
        <ul>
          <li>阅读我们的文档了解更多高级功能</li>
          <li>查看示例项目获取灵感</li>
          <li>加入我们的社区讨论和分享</li>
        </ul>
        
        <p>我们期待看到你用 Quick Forge AI 创建的令人惊叹的应用！</p>
      </div>
    </div>
  )
} 