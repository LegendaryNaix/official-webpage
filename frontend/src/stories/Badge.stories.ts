import Badge, { BadgeColor } from '@/components/Badge'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Badge',
  component: Badge,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      description: '뱃지 색상'
    },
    content: {
      description: '뱃지 텍스트'
    }
  }
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    color: BadgeColor.yellow,
    content: 'Badge'
  }
}
