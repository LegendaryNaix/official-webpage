/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  extends: [
    'next/babel',
    'next/core-web-vitals',
    'plugin:storybook/recommended'
  ],
  env: {
    browser: true,
    node: true
  },
  rules: {
    '@next/next/no-html-link-for-pages': [
      'error',
      require('path').join(__dirname, 'src/app')
    ]
  },
  overrides: [
    {
      files: ['*.tsx'],
      rules: {
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'function-declaration'
          }
        ]
      }
    },
    {
      files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
      rules: {
        'storybook/hierarchy-separator': 'error',
        'storybook/default-exports': 'off'
      }
    }
  ]
}
