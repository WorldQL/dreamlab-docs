import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <b>Dreamlab Documentation</b>,
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Dreamlab Docs',
    }
  },
  project: {
    link: 'https://github.com/WorldQL/dreamlab-core',
  },
  chat: {
    link: 'https://discord.gg/nwXFvtJ92g',
  },
  docsRepositoryBase: 'https://github.com/WorldQL/dreamlab-docs/blob/trunk',
  footer: {
    text: `Copyright © ${new Date().getFullYear()} WorldQL Corporation`,
  },
}

export default config
