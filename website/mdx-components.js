import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

// 获取默认的MDX组件
const docsComponents = getDocsMDXComponents()

// 合并组件
/**
 * Customizes MDX components with additional components.
 *
 * This function allows you to extend the default set of MDX components with your own custom components.
 *
 * @param {Object} components - An object containing custom MDX component overrides.
 * @returns {Object} - An object that merges the default MDX components (`docsComponents`) with the provided custom components.
 * @example
 * // Usage of useMDXComponents to add a custom component
 *
 * import useMDXComponents from './useMDXComponents';
 *
 * const MyCustomComponent = () => {
 *   return <div>My Custom Component</div>;
 * };
 *
 * const MDXComponents = useMDXComponents({ CustomComponent: MyCustomComponent });
 */
export function useMDXComponents(components) {
  return {
    ...docsComponents,
    ...components,
  }
} 