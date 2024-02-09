import clsx from 'clsx'

export enum BadgeColor {
  gray = 'gray',
  red = 'red',
  yellow = 'yellow',
  green = 'green',
  blue = 'blue',
  indigo = 'indigo',
  purple = 'purple',
  pink = 'pink'
}

interface BadgeProps {
  color: BadgeColor
  content: string
}

export default function Badge({ color, content }: BadgeProps) {
  const colorClasses = {
    [BadgeColor.gray]: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
    [BadgeColor.red]: 'text-red-400 bg-red-400/10 ring-red-400/20',
    [BadgeColor.yellow]: 'text-yellow-500 bg-yellow-400/10 ring-yellow-400/20',
    [BadgeColor.green]: 'text-green-500 bg-green-400/10 ring-green-400/20',
    [BadgeColor.blue]: 'text-blue-500 bg-blue-400/10 ring-blue-400/20',
    [BadgeColor.indigo]: 'text-indigo-500 bg-indigo-400/10 ring-indigo-400/20',
    [BadgeColor.purple]: 'text-purple-500 bg-purple-400/10 ring-purple-400/20',
    [BadgeColor.pink]: 'text-pink-500 bg-pink-400/10 ring-pink-400/20'
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
        colorClasses[color]
      )}
    >
      {content}
    </span>
  )
}
