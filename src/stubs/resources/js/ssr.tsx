import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/inertia-react'
import createServer from '@inertiajs/server'
import { RouteContext } from '@/hooks/useRoute'
import route from 'ziggy-js'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

const appName = 'Laravel'

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
      const parts = name.split('/')
      const path = parts
        .map((part, i) =>
          i !== parts.length - 1 ? part.toLocaleLowerCase() : part,
        )
        .join('/')

      return resolvePageComponent(
        `./pages/${path}.tsx`,
        import.meta.glob('./pages/**/*.tsx'),
      )
    },
    setup: ({ App, props }) => {
      const ssrRoute = (name: any, params: any, absolute: any, config: any) => {
        return route(name, params, absolute, {
          ...(page.props as any).ziggy,
          location: new URL((page.props as any).ziggy.url),
          ...config,
        })
      }
      return (
        <RouteContext.Provider value={ssrRoute as any}>
          <App {...props} />
        </RouteContext.Provider>
      )
    },
  }),
)
