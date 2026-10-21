import { defineConfig } from 'vitest/config';

// Keep local development and preview at the site root. GitHub Pages project
// sites live under /<repository-name>/, so only deployment builds use that base.
const base = process.env.DEPLOY_TARGET === 'github-pages'
  ? '/bigtech-survival-guide/'
  : '/';

export default defineConfig({
  base,
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
