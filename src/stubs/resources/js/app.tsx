import './bootstrap'
import '../css/app.css'

import React from 'react'
import { render } from 'react-dom'
import { createInertiaApp } from '@inertiajs/inertia-react'
import { InertiaProgress } from '@inertiajs/progress'
import { RouteContext } from '@/hooks/useRoute'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

const appName =
  window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel'

createInertiaApp({
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
  setup({ el, App, props }) {
    return render(
      <RouteContext.Provider value={(window as any).route}>
        <App {...props} />
      </RouteContext.Provider>,
      el,
    )
  },
})

InertiaProgress.init({ color: '#4B5563' })
