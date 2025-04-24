import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'

export async function getPosts() {
  const { directories } = normalizePages({
    list: await getPageMap('/blog/posts'), // Adjusted route
    route: '/blog/posts' // Adjusted route
  })
  return directories
    .filter(post => post.name !== 'index' && !post.route.endsWith('/page')) // Filter out index and the page itself
    .sort((a, b) => new Date(b.frontMatter?.date || 0) - new Date(a.frontMatter?.date || 0))
}

export async function getTags() {
  const posts = await getPosts()
  const tags = posts.flatMap(post => post.frontMatter?.tags || [])
  // Deduplicate and count tags
  const tagCount = tags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  return tagCount; // Return object with counts instead of flat list
} 