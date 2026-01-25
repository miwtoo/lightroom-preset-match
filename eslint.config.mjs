import nextConfig from 'next/eslint-plugin'

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@next/next': nextConfig,
    },
    rules: {
      ...nextConfig.configs.recommended.rules,
    },
  },
]
