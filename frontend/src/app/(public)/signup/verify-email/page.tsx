import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import VerifyEmailForm from './_components/VerifyEmailForm'

export default function VerifyEmailAddressPage({
  searchParams
}: {
  searchParams?: {
    email?: string
  }
}) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col items-center justify-center p-6 lg:px-8">
      <div className="flex w-full max-w-[320px] flex-col items-center gap-y-10">
        {searchParams?.email ? (
          <>
            <Image
              src="/text-logo.png"
              alt="ROYALS"
              width={1158}
              height={277}
              className="hidden h-auto w-full max-w-[320px] dark:inline-block"
              priority={true}
            />
            <Image
              src="/text-logo-light.png"
              alt="ROYALS"
              width={1158}
              height={277}
              className="inline-block h-auto w-full max-w-[320px] dark:hidden"
              priority={true}
            />
            <p className="text-md fond-bold text-center">
              <span className="text-amber-400">{searchParams.email}</span>으(로)
              전송된
              <br />
              인증코드 6자리를 입력해주세요
            </p>
            <VerifyEmailForm email={searchParams.email} />
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold">[ERROR] 잘못된 접근입니다</h1>
            <Link href="/">
              <Button size="sm">메인으로</Button>
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
