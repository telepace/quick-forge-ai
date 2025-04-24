'use client'

export default function GettingStartedPost() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Getting Started with Quick Forge AI</h1>
      <p className="text-gray-500 mb-8">Published Date: April 20, 2024</p>
      
      <div className="prose lg:prose-xl">
        <p>Welcome to Quick Forge AI! This article will guide you through how to quickly get started with building your first AI application using our platform.</p>
        
        <h2>What is Quick Forge AI?</h2>
        <p>Quick Forge AI is an open-source platform designed to help developers build AI applications quickly. Whether you're an experienced developer or new to the AI field, our platform can help you easily bring your ideas to life.</p>
        
        <h2>Installation</h2>
        <p>First, you need to install our CLI tool via npm:</p>
        <pre><code>npm install -g @quick-forge/cli</code></pre>
        
        <h2>Creating a New Project</h2>
        <p>After installation, you can use the following command to create a new project:</p>
        <pre><code>quick-forge create my-ai-app</code></pre>
        
        <h2>Selecting a Template</h2>
        <p>We offer various project templates, including:</p>
        <ul>
          <li>Chatbot</li>
          <li>Text Generation</li>
          <li>Image Recognition</li>
          <li>Voice Assistant</li>
        </ul>
        
        <h2>Configuring the AI Model</h2>
        <p>In the <code>config.json</code> file, you can specify the AI model and parameters to use:</p>
        <pre><code>{`{
  "model": "gpt-4",
  "temperature": 0.7,
  "max_tokens": 1000
}`}</code></pre>
        
        <h2>Running Your Application</h2>
        <p>After configuration, run the following commands to start your application:</p>
        <pre><code>cd my-ai-app
npm install
npm start</code></pre>
        
        <h2>Next Steps</h2>
        <p>Congratulations! You have successfully created your first AI application. Next, you can:</p>
        <ul>
          <li>Read our documentation to learn more about advanced features</li>
          <li>Check out example projects for inspiration</li>
          <li>Join our community to discuss and share</li>
        </ul>
        
        <p>We look forward to seeing the amazing applications you create with Quick Forge AI!</p>
      </div>
    </div>
  )
} 