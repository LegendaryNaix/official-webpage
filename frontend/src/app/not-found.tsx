import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center space-y-5">
      <h1 className="text-4xl font-bold">Not Found</h1>
      <p>요청하신 페이지가 존재하지 않습니다</p>
      <Link href="/">
        <Button>홈으로 이동</Button>
      </Link>
    </div>
  )
}
