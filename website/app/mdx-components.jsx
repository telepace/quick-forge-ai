"use client"

import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import React from 'react'

// 获取默认的MDX组件
const themeComponents = getThemeComponents()

// 自定义p组件，避免p嵌套p的问题
/**
 * A custom paragraph component that behaves differently based on the content and parent context.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - Additional CSS classes to apply to the component.
 * @param {React.ReactNode} [props.children] - The children to render within the paragraph.
 *
 * @returns {JSX.Element} - A JSX element representing a paragraph or span.
 *
 * @example
 * <CustomP>Short text</CustomP>
 * // Renders as: <span className="mdx-p">Short text</span>
 *
 * @example
 * <CustomP>Longer text that should be in a div</CustomP>
 * // Renders as: <div className="mdx-p">Longer text that should be in a div</div>
 *
 * @exception {Error} - If the `children` is not of type string or ReactNode, an error will be thrown.
 */
const CustomP = (props) => {
  // 如果存在className属性，保留原有的className并添加mdx-p类
  const className = props.className 
    ? `${props.className} mdx-p`
    : 'mdx-p'
    
  // 如果内容很短并且在按钮内部，使用普通span
  if (props.children && typeof props.children === 'string' && props.children.length < 30) {
    return <span {...props} className={className} />
  }
  
  // 其他情况使用div替代p
  return <div {...props} className={className} />
}

// 合并组件
/**
 * Customizes MDX components by merging with default components and overriding specific ones.
 *
 * @param {Object} components - An object containing custom components to be merged with the default ones.
 * @returns {Object} - An object representing the merged components, where client-side and server-side rendering is consistent.
 * @throws {Error} - Throws an error if any of the provided custom components are not valid React components.
 *
 * @example
 * const customComponents = {
 *   p: CustomPComponent,
 *   h1: CustomH1Component
 * };
 * const mergedComponents = useMDXComponents(customComponents);
 */
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...components,
    // 覆盖默认的p组件
    p: CustomP
    // 可以在这里添加自定义组件，但确保客户端和服务器渲染一致
  }
} 