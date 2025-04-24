import { useMDXComponents as getBlogMDXComponents } from 'nextra-theme-blog'

const blogComponents = getBlogMDXComponents()

/**
 * Combines custom MDX components with predefined blog components.
 *
 * @function
 * @param {Object} components - An object containing custom MDX components to be merged with the predefined ones.
 * @returns {Object} - An object containing all MDX components, with custom components overriding any duplicates.
 *
 * @example
 * const myCustomComponents = {
 *   MyComponent: <div>My Custom Component</div>,
 * };
 * const combinedComponents = useMDXComponents(myCustomComponents);
 * console.log(combinedComponents); // { BlogHeader, BlogFooter, ...myCustomComponents }
 */
export function useMDXComponents(components) {
  return {
    ...blogComponents,
    ...components
    // 这里可以添加您的自定义组件
  }
} 