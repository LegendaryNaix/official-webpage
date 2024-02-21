export enum ButtonSize {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl'
}

interface ButtonProps {
  content: string
  size: ButtonSize
  type: 'submit' | 'button' | 'reset'
  accent?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any
}

export default function Button({
  content,
  size,
  type,
  icon: Icon
}: ButtonProps) {
  const render = (size: ButtonSize) => {
    switch (size) {
      case ButtonSize.xs:
        return (
          <button
            type={type}
            className="inline-flex items-center gap-x-1.5 rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-950 shadow-sm hover:bg-gray-400"
          >
            {Icon && <Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" />}
            {content}
          </button>
        )
      case ButtonSize.sm:
        return (
          <button
            type={type}
            className="inline-flex items-center gap-x-1.5 rounded bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-950 shadow-sm hover:bg-gray-400"
          >
            {Icon && <Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" />}
            {content}
          </button>
        )
      case ButtonSize.lg:
        return (
          <button
            type={type}
            className="inline-flex items-center gap-x-2 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-950 shadow-sm hover:bg-gray-400"
          >
            {Icon && <Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" />}
            {content}
          </button>
        )
      case ButtonSize.xl:
        return (
          <button
            type={type}
            className="inline-flex items-center gap-x-2 rounded-md bg-gray-200 px-3.5 py-2.5 text-sm font-semibold text-gray-950 shadow-sm hover:bg-gray-400"
          >
            {Icon && <Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" />}
            {content}
          </button>
        )
      case ButtonSize.md:
      default:
        return (
          <button
            type={type}
            className="inline-flex items-center gap-x-2 rounded-md bg-gray-200 px-2.5 py-1.5 text-sm font-semibold text-gray-950 shadow-sm hover:bg-gray-400"
          >
            {Icon && <Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" />}
            {content}
          </button>
        )
    }
  }

  return <>{render(size)}</>
}
