import { Button } from '@/components/ui/button'
import { AccountStatus } from '@/lib/enums'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function UnverifiedPage({
  searchParams
}: {
  searchParams?: {
    status?: AccountStatus
  }
}) {
  const status = searchParams?.status ?? AccountStatus.Disable

  const renderStatus = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.Verifying:
        return (
          <div className="flex flex-col space-y-1.5">
            <div className="flex flex-row items-center">
              <CheckCircleIcon className="mr-1.5 mt-1 h-6 w-6 text-green-500" />
              <p>이메일 인증이 완료되었습니다</p>
            </div>
            <div className="flex flex-row items-center">
              <ExclamationTriangleIcon className="mr-1.5 mt-1 h-6 w-6 text-red-500" />
              <p>관리자가 아직 회원가입을 승인하지 않았습니다</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col space-y-1.5">
            <div className="flex flex-row items-center">
              <ExclamationTriangleIcon className="mr-1.5 mt-1 h-6 w-6 text-red-500" />
              <p>이메일 인증이 완료되지 않았습니다</p>
            </div>
            <div className="flex flex-row items-center">
              <ExclamationTriangleIcon className="mr-1.5 mt-1 h-6 w-6 text-red-500" />
              <p>관리자가 아직 회원가입을 승인하지 않았습니다</p>
            </div>
          </div>
        )
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col items-center justify-center p-6 lg:px-8">
      <div className="flex w-full flex-col items-center justify-center space-y-5">
        <h1 className="text-xl font-bold">
          계정 인증절차가 완료되지 않았습니다
        </h1>
        {renderStatus(status)}
        <Link href="/">
          <Button variant={'outline'}>메인으로</Button>
        </Link>
      </div>
    </main>
  )
}
