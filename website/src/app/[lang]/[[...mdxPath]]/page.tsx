import type { Metadata } from 'next'
import { getDictionary } from '@/app/_dictionaries/dictionaries'
import { HomepageHero } from '@/components/HomepageHero/HomepageHero'
import { notFound, redirect } from 'next/navigation'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { NextraContentWrapper } from '@/app/[lang]/_components/NextraStyleFix'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

/**
 * Generates metadata for a given page based on provided properties.
 *
 * @async
 * @param {PageProps} props - The properties of the page including parameters and language information.
 * @returns {Promise<Metadata>} A promise that resolves to an object containing the title and description of the page.
 *
 * This function determines whether the provided path corresponds to a home page or not.
 * If it is, metadata from a dictionary is used. For other paths, it attempts to import the
 * metadata from the corresponding mdx file. In case of an error during this process,
 * default metadata indicating that the page was not found is returned.
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params

  // Determine if it is a valid home page path (root path or /home)
  const isHomePagePath = !params.mdxPath || params.mdxPath.length === 0 || (params.mdxPath.length === 1 && params.mdxPath[0] === 'home')

  // If it is a home page path, use metadata from the dictionary
  if (isHomePagePath) {
    const dict = await getDictionary(params.lang)
    return {
      title: dict.metadata.home.title,
      description: dict.metadata.home.description,
    }
  }

  // For non-home page paths, process the actual mdxPath
  const mdxPath = params.mdxPath!

  try {
    const { metadata } = await importPage(mdxPath, params.lang)
    return metadata || { title: 'Page', description: '...' }
  }
  catch (error) {
    console.error(`Error loading metadata for path ${params.lang}/${mdxPath.join('/')}:`, error)
    return {
      title: 'Not Found',
      description: 'The requested page could not be found.',
    }
  }
}

type PageProps = Readonly<{
  params: Promise<{
    mdxPath: string[] | undefined
    lang: string
  }>
}>

/**
 * The default function that handles rendering of pages based on language and path parameters.
 *
 * @async
 * @function Page
 * @param {PageProps} props - An object containing properties for the page component.
 * @returns {JSX.Element | void} - A JSX element representing the rendered page or void if an error occurs.
 *
 * @throws Will throw an error and redirect to '404' if there is a failure in loading the MDX content.
 */
export default async function Page(props: PageProps) {
  const params = await props.params

  // Ensure the language code is valid, otherwise redirect to English
  if (params.lang !== 'en' && params.lang !== 'zh') {
    redirect('/en')
  }

  // Check if it is a root path (home page)
  const isHomePage = !params.mdxPath || params.mdxPath.length === 0

  // If it is a home page, render the home page component
  if (isHomePage) {
    const dict = await getDictionary(params.lang)

    return (
      <div className="nextra-content-container">
        <HomepageHero
          title={dict.home.hero.title}
          subtitle={dict.home.hero.subtitle}
          cta={dict.home.hero.cta}
          lang={params.lang}
        />

        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {dict.home.features.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dict.home.features.items.map((feature, index) => (
              <div
                key={index}
                className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Unified path processing
  const mdxPath = Array.isArray(params.mdxPath) && params.mdxPath.length > 0
    ? [...params.mdxPath]
    : ['index']

  // Handle 'home' special path - redirect to root path
  if (mdxPath.length === 1 && mdxPath[0] === 'home') {
    return redirect(`/${params.lang}`)
  }

  console.log(`Attempting to load page for path: ${params.lang}/${mdxPath.join('/')}`)

  try {
    const result = await importPage(mdxPath, params.lang)
    const { default: MDXContent, toc, metadata } = result

    // Pass the parsed path to the MDXContent parameter
    const pageParams = { ...await props.params, mdxPath }

    return (
      <NextraContentWrapper toc={toc} metadata={metadata}>
        <MDXContent {...props} params={pageParams} />
      </NextraContentWrapper>
    )
  }
  catch (error) {
    // If importing from Nextra fails, try to load the content directly
    console.error('Error loading page:', error)
    notFound()
  }
}
