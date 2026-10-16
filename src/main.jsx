import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App, { normalizePath } from './App.jsx'
import { upgradeLegacyHash } from './lib/router'
import './index.css'

const legacyLink = window.location.hash.startsWith('#/') // an old /#/rooms link opens the home HTML first
upgradeLegacyHash() // ...and becomes /rooms
const root = document.getElementById('root')
const app = <React.StrictMode><App initialPath={normalizePath(window.location.pathname)} /></React.StrictMode>
// The build pre-renders every page, so hydrate when HTML is already there (in `npm run dev` the root is empty).
if (root.hasChildNodes() && !legacyLink) hydrateRoot(root, app)
else { root.textContent = ''; createRoot(root).render(app) }
