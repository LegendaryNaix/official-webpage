'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from './ui/input'

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams)

    if (searchTerm) {
      params.set('searchTerm', searchTerm)
    } else {
      params.delete('searchTerm')
    }

    replace(`${pathname}?${params.toString()}`)
  }, 500)

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        id="search"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}
