import React from 'react'
import { useConfig } from 'nextra-theme-docs'
import type { DocsThemeConfig } from 'nextra-theme-docs'

const siteName = 'Dreamlab Docs'
const defaultDescription = ''

const config: DocsThemeConfig = {
  logo: <b>Dreamlab Documentation</b>,
  head: () => {
    const config = useConfig()
    const frontmatter = config.frontMatter

    const title = `${config.title} - ${siteName}`
    const description = frontmatter.description ?? defaultDescription

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
