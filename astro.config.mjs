// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://bwai-share.vercel.app',
  integrations: [
    starlight({
      title: 'Brilliant With AI',
      description:
        'Shared artifacts and docs from Claude Code sessions, for review.',
      customCss: ['./src/styles/custom.css'],
      // Built-in Pagefind search ships on by default; listed here for clarity.
      pagefind: true,
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Add content', slug: 'guides/adding-content' },
            { label: 'Deploy', slug: 'guides/deploying' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Why this framework', slug: 'reference/framework-choice' },
            { label: 'Access control', slug: 'reference/access-control' },
          ],
        },
      ],
    }),
  ],
});
