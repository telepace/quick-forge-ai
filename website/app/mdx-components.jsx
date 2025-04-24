import React from 'react'

// 创建静态的MDX组件配置
const mdxComponents = {
  // 为不同元素定义基础样式
  h1: props => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: props => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
  h3: props => <h3 className="text-2xl font-bold mt-5 mb-2" {...props} />,
  ul: props => <ul className="list-disc pl-5 my-4" {...props} />,
  ol: props => <ol className="list-decimal pl-5 my-4" {...props} />,
  li: props => <li className="my-1" {...props} />,
  a: props => <a className="text-blue-600 hover:underline" {...props} />,
  p: props => <p className="my-4" {...props} />
}

// Next.js需要这个导出格式
/**
 * Combines custom MDX components with default MDX components.
 *
 * @param {Object} components - An object containing custom MDX components to be merged with the default ones.
 * @returns {Object} An object that merges both the default and custom MDX components, with custom components taking precedence.
 *
 * @example
 * const myComponents = {
 *   Heading: (props) => <h1 style={{ color: 'red' }}>{props.children}</h1>
 * };
 * const combinedComponents = useMDXComponents(myComponents);
 * // combinedComponents now includes both default and custom MDX components with custom ones taking precedence.
 */
export function useMDXComponents(components) {
  return { ...mdxComponents, ...components }
} 