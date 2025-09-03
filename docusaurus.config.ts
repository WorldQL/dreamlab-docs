import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Dreamlab Docs",
  tagline: "Developer documentation for the Dreamlab game engine",
  favicon: "img/icon-64x64.png",

  // Set the production url of your site here
  url: "https://docs.dreamlab.gg",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "WorldQL", // Usually your GitHub org/user name.
  projectName: "dreamlab-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  headTags: [{ tagName: "meta", attributes: { name: "algolia-site-verification", content: "124F48323C67E480" } }],

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/WorldQL/dreamlab-docs/edit/trunk',
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: "Dreamlab Docs",
      logo: {
        alt: "My Site Logo",
        src: "img/icon-64x64.png",
      },
      items: [
        {
          href: "https://app.dreamlab.gg/",
          label: "Open Dreamlab",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/nwXFvtJ92g",
            },
            {
              label: "X / Twitter",
              href: "https://x.com/DreamlabEngine",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "https://dreamlab.gg/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/WorldQL/dreamlab-engine",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} WorldQL Corporation`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: "HYJ95WQSTU",
      apiKey: "e964405434b4849c9edc53323eeb5b29",
      indexName: "Documentation Website",
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
