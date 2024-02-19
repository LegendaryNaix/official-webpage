import Table from '@/components/Table'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Table',
  component: Table,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    headers: {
      description: '테이블 헤더'
    },
    items: {
      description: '테이블 내용'
    }
  }
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    headers: [
      {
        key: 'name',
        label: 'Name'
      },
      {
        key: 'gender',
        label: 'Gender'
      },
      {
        key: 'age',
        label: 'Age'
      }
    ],
    items: [
      {
        name: 'Michael',
        gender: 'male',
        age: '23'
      },
      {
        name: 'Michael',
        gender: 'male',
        age: '23'
      },
      {
        name: 'Michael',
        gender: 'male',
        age: '23'
      }
    ]
  }
}
