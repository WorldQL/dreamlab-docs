import React from 'react'
import { useConfig } from 'nextra-theme-docs'
import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <b>Dreamlab Documentation</b>,
  head: () => {
    const config = useConfig()
    const siteName = 'Dreamlab Docs'

    const title = `${config.title} - ${siteName}`
    const description = 'Create multiplayer games fast!'

    return (
      <>
        <title>{title}</title>
        <meta name='description' content={description} />

        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
      </>
    )
  },
  project: {
    link: 'https://github.com/WorldQL/dreamlab-core',
  },
  chat: {
    link: 'https://discord.gg/nwXFvtJ92g',
  },
  docsRepositoryBase: 'https://github.com/WorldQL/dreamlab-docs/blob/trunk',
  footer: {
    content: `Copyright © ${new Date().getFullYear()} WorldQL Corporation`,
  },
}

export default config
