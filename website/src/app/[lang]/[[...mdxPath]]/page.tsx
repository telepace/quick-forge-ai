import { useMDXComponents } from '@/mdx-components'
import { generateStaticParamsFor, importPage } from 'nextra/pages'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

/**
 * Generates metadata for a page based on the provided parameters.
 *
 * @async
 * @function generateMetadata
 * @param {PageProps} props - The properties object containing necessary information to fetch the page.
 * @returns {Promise<Object>} A promise that resolves with the fetched metadata.
 * @throws {Error} If there is an error in fetching or processing the page metadata.
 *
 * Example:
 * const params = {
 *   mdxPath: 'path/to/page.mdx',
 *   lang: 'en'
 * };
 * generateMetadata({ params }).then(metadata => console.log(metadata));
 */
export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath, params.lang)
  return metadata
}

type PageProps = Readonly<{
  params: Promise<{
    mdxPath: string[]
    lang: string
  }>
}>
const Wrapper = useMDXComponents().wrapper

/**
 * The main function that renders an MDX page.
 *
 * @param {PageProps} props - The properties object containing necessary data for rendering the page.
 * @returns {Promise<JSX.Element>} - A Promise that resolves to a JSX Element representing the rendered page.
 * @throws {Error} - Throws an error if there is an issue importing or processing the MDX content.
 *
 * @example
 * const props = {
 *   params: {
 *     mdxPath: 'path/to/mdx/file.mdx',
 *     lang: 'en'
 *   }
 * };
 * Page(props).then(element => console.log(element));
 */
export default async function Page(props: PageProps) {
  const params = await props.params
  const result = await importPage(params.mdxPath, params.lang)
  const { default: MDXContent, toc, metadata } = result


  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
