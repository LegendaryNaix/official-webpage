import Image from 'next/image'
import LoginForm from './_components/LoginForm'

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col items-center justify-center p-6 lg:px-8">
      <div className="flex w-full max-w-[320px] flex-col items-center gap-y-10">
        <Image
          src="/text-logo.png"
          alt="ROYALS"
          width={290}
          height={70}
          className="h-auto w-full max-w-[320px]"
        />
        <LoginForm />
      </div>
    </main>
  )
}
