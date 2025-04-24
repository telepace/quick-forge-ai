import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'

/**
 * Fetches posts from a blog directory and returns them sorted by date in descending order.
 *
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of post objects, each containing metadata like title, date, etc.
 * @throws {Error} - If there is an error fetching the page map or normalizing the pages.
 */
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