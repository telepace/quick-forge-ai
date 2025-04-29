import { useMDXComponents as _useMDXComponents } from 'nextra-theme-docs'

/**
 * Custom hook to register MDX components for use within an MDX environment.
 *
 * @param {Object} components - An object containing custom components to be registered.
 *                               Each key should correspond to the component name used in MDX files,
 *                               and each value should be a React component.
 * @returns {Function} The function returned by _useMDXComponents, which is responsible
 *                     for setting up and managing the registered components.
 *
 * @throws {TypeError} Throws an error if the 'components' parameter is not an object.
 */
export function useMDXComponents(components) {
  return _useMDXComponents(components)
} 