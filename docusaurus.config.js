// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Samuele1818 Blog',
  tagline: 'Explore tutorials and blog posts',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Samuele1818', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.
  
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  
  presets: [
    [
      /** @type {import('@docusaurus/preset-classic').Options} */
      'classic',
      ({
        docs: false,
        blog: {
          showReadingTime: true,
          remarkPlugins: [require('mdx-mermaid')],
          blogTitle: 'Samuele1818\'blog!',
          blogDescription: 'Talk about !',
          postsPerPage: 'ALL',
          blogSidebarTitle: 'Posts',
          blogSidebarCount: 'ALL',
          routeBasePath: '/',
          // Please change this to your repo.
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  
  plugins: ['@docusaurus/theme-live-codeblock', 'plugin-image-zoom',     [
    require.resolve("@cmfcmf/docusaurus-search-local"),
    {
      indexDocs: false,
      indexDocSidebarParentCategories: 0,
      indexBlog: true,
      indexPages: false,
      language: "en",
    },
  ],],
  
  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      liveCodeBlock: {
        playgroundPosition: 'bottom',
      },
      navbar: {
        title: 'Samuele Sciatore',
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Contacts',
            items: [
              {
                label: 'Github',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      },
      imageZoom: {
        // CSS selector to apply the plugin to, defaults to '.markdown img'
        selector: '.markdown img',
        // Optional medium-zoom options
        // see: https://www.npmjs.com/package/medium-zoom#options
        options: {
          margin: 24,
          background: '#BADA55',
          scrollOffset: 0,
          container: '#zoom-container',
          template: '#zoom-template',
        },
      },
    }),
};

module.exports = config;
