/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  extends: ['next/core-web-vitals', 'plugin:storybook/recommended'],
  env: {
    browser: true,
    node: true
  },
  rules: {
    '@next/next/no-html-link-for-pages': [
      'error',
      require('path').join(__dirname, 'src/app')
    ],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration'
      }
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
        ],
        'func-style': ['off']
      }
    },
    {
      files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
      rules: {
        'storybook/hierarchy-separator': 'error',
        'storybook/default-exports': 'off',
        'func-style': ['off']
      }
    }
  ]
}
