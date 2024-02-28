'use client'

import { useDate } from '@/hooks/useDate'

export default function LocalTime({
  utc,
  format,
  className,
  ...props
}: {
  utc: string
  format: string
  className?: string
}) {
  const { parseUTCDate, formatDate } = useDate()
  return (
    <time defaultValue={utc} className={className} {...props}>
      {formatDate(parseUTCDate(utc), format)}
    </time>
  )
}
