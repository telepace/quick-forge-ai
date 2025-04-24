import React from 'react'

// Create static MDX component configurations
const mdxComponents = {
  // Define basic styles for different elements
  h1: props => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: props => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
  h3: props => <h3 className="text-2xl font-bold mt-5 mb-2" {...props} />,
  ul: props => <ul className="list-disc pl-5 my-4" {...props} />,
  ol: props => <ol className="list-decimal pl-5 my-4" {...props} />,
  li: props => <li className="my-1" {...props} />,
  a: props => <a className="text-blue-600 hover:underline" {...props} />,
  p: props => <p className="my-4" {...props} />
}

// Next.js requires this export format
export function useMDXComponents(components) {
  return { ...mdxComponents, ...components }
} 