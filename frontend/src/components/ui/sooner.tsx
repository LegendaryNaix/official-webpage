import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

export default function Toaster({ ...props }: ToasterProps) {
  return <Sonner theme="dark" className="toaster group" {...props} />
}
