import Button, { ButtonSize } from '@/components/Button'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      description: '버튼에 표시될 텍스트'
    },
    size: {
      control: { type: 'select' },
      description: '버튼 사이즈'
    },
    type: {
      control: { type: 'select' },
      description: '버튼 종류'
    },
    icon: {
      control: { disable: true },
      description: `"@heroicons/react" 라이브러리 내 아이콘`
    }
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: ButtonSize.md,
    content: 'Button',
    type: 'button'
  }
}

export const WithIcon: Story = {
  args: {
    size: ButtonSize.md,
    content: 'Button',
    type: 'button',
    icon: CheckCircleIcon
  }
}

export const Large: Story = {
  args: {
    size: ButtonSize.lg,
    content: 'Button',
    type: 'button'
  }
}

export const Small: Story = {
  args: {
    size: ButtonSize.sm,
    content: 'Button',
    type: 'button'
  }
}
