"use client"

import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import React from 'react'

// 获取默认的MDX组件
const themeComponents = getThemeComponents()

// 自定义p组件，避免p嵌套p的问题
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
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...components,
    // 覆盖默认的p组件
    p: CustomP
    // 可以在这里添加自定义组件，但确保客户端和服务器渲染一致
  }
} 