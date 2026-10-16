import { renderToString } from 'react-dom/server'
import App from './App.jsx'
export { routes, notFound, headTags, sitemapXml, robotsTxt, indexableRoutes } from './data/seo'

export const render = (path) => renderToString(<App initialPath={path} />)
