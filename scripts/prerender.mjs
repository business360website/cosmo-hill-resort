// Pre-renders every page to static HTML after `vite build` + `vite build --ssr`.
// Output: dist/<route>.html (e.g. dist/rooms.html), dist/index.html, dist/404.html, dist/sitemap.xml, dist/robots.txt
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const entry = fs.readdirSync(ssrDir).find((f) => /^entry-server\.(m?js)$/.test(f))
const { render, routes, headTags, sitemapXml, robotsTxt } = await import(pathToFileURL(path.join(ssrDir, entry)).href)

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--SEO_HEAD-->') || !template.includes('<!--SSR_ROOT-->')) throw new Error('index.html is missing the SEO_HEAD / SSR_ROOT markers')

const make = (route, { is404 = false } = {}) => {
  let head = headTags(route, { is404 })
  if (route === '/') head += '\n    <link rel="preload" as="image" href="/assets/hero-poster.jpg" fetchpriority="high" />'
  return template.replace('<!--SEO_HEAD-->', head).replace('<!--SSR_ROOT-->', render(is404 ? '/__404__' : route))
}

let count = 0
for (const route of Object.keys(routes)) {
  const file = route === '/' ? 'index.html' : route.slice(1) + '.html'
  fs.writeFileSync(path.join(dist, file), make(route))
  count++
}
fs.writeFileSync(path.join(dist, '404.html'), make('/404', { is404: true }))
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemapXml())
fs.writeFileSync(path.join(dist, 'robots.txt'), robotsTxt())
fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`Pre-rendered ${count} pages + 404.html, sitemap.xml and robots.txt`)
