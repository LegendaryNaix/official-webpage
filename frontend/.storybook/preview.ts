import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#000000' }
      ]
    },
    docs: {
      theme: themes.dark
    }
  }
}

export default preview
