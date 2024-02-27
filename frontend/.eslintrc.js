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
    ]
  },
  overrides: [
    // TODO: If there is another way to solve the '@next/babel' error, remove below object
    {
      files: ['*.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020
      }
    },
    {
      files: ['*.tsx'],
      excludedFiles: ['src/components/ui/*.tsx'],
      rules: {
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'function-declaration'
          }
        ],
        'func-style': ['off'],
        'no-restricted-imports': ['error']
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
