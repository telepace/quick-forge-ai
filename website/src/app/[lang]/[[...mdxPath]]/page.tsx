import type { Metadata } from 'next'
import { getDictionary } from '@/app/_dictionaries/dictionaries'
import { HomepageHero } from '@/components/HomepageHero/HomepageHero'
import { notFound, redirect } from 'next/navigation'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { NextraContentWrapper } from '@/app/[lang]/_components/NextraStyleFix'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params

  // 确定是否为有效的主页路径（根路径或 /home）
  const isHomePagePath = !params.mdxPath || params.mdxPath.length === 0 || (params.mdxPath.length === 1 && params.mdxPath[0] === 'home')

  // 如果是主页路径，则使用字典中的元数据
  if (isHomePagePath) {
    const dict = await getDictionary(params.lang)
    return {
      title: dict.metadata.home.title,
      description: dict.metadata.home.description,
    }
  }

  // 对于非主页路径，处理实际的 mdxPath
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

export default async function Page(props: PageProps) {
  const params = await props.params

  // 确保语言代码有效，否则重定向到英文
  if (params.lang !== 'en' && params.lang !== 'zh') {
    redirect('/en')
  }

  // 检查是否为根路径（首页）
  const isHomePage = !params.mdxPath || params.mdxPath.length === 0

  // 如果是首页，渲染首页组件
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

  // 统一路径处理
  const mdxPath = Array.isArray(params.mdxPath) && params.mdxPath.length > 0
    ? [...params.mdxPath]
    : ['index']

  // 处理'home'特殊路径 - 重定向到根路径
  if (mdxPath.length === 1 && mdxPath[0] === 'home') {
    return redirect(`/${params.lang}`)
  }

  console.log(`Attempting to load page for path: ${params.lang}/${mdxPath.join('/')}`)

  try {
    const result = await importPage(mdxPath, params.lang)
    const { default: MDXContent, toc, metadata } = result

    // 传递解析的路径到 MDXContent 参数
    const pageParams = { ...await props.params, mdxPath }

    return (
      <NextraContentWrapper toc={toc} metadata={metadata}>
        <MDXContent {...props} params={pageParams} />
      </NextraContentWrapper>
    )
  }
  catch (error) {
    // 如果从Nextra导入失败，尝试直接加载内容
    console.error('Error loading page:', error)
    notFound()
  }
}
