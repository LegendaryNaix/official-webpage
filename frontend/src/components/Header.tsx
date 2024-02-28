'use client'

import { auth } from '@/lib/auth'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const navigation = [
  { name: '로스터', href: '#' },
  { name: '일정/결과', href: '#' },
  { name: '게시판', href: '#' },
  { name: '소개', href: '#' }
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      const session = await auth()

      if (session) setIsLogin(true)
      else setIsLogin(false)
    }

    getSession()
  }, [])

  return (
    <header className="fixed left-0 top-0 z-10 w-full border-b border-zinc-200 bg-transparent backdrop-blur-sm dark:border-zinc-600">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8"
        aria-label="Global"
      >
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">SKKU ROYALS</span>
          <Image
            className="h-6 w-auto lg:h-8"
            src="/logo.png"
            alt="ROYALS"
            width={1312}
            height={800}
          />
        </Link>
        <div className="flex items-center gap-x-3 lg:hidden">
          <ThemeToggle />
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-900 dark:text-gray-50"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="hidden lg:flex lg:items-center lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-zinc-900 dark:text-gray-50"
            >
              {item.name}
            </Link>
          ))}
          <ThemeToggle />
          <Link
            href={isLogin ? '/console/dashboard' : '/login'}
            className="text-sm font-semibold leading-6 text-zinc-900 dark:text-gray-50"
          >
            {isLogin ? '콘솔로 이동' : '로그인'}{' '}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-20" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-white px-6 pt-[20px] sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-black">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">SKKU ROYALS</span>
              <Image
                className="h-6 w-auto"
                src="/logo.png"
                alt="ROYALS"
                width={1312}
                height={800}
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-zinc-900 dark:text-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-8 flow-root">
            <div className="-my-6 divide-y-2 divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-zinc-900 hover:bg-gray-400 hover:text-zinc-900/90 dark:text-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href={isLogin ? '/console/dashboard' : '/login'}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-zinc-900 hover:bg-gray-400 hover:text-zinc-900/90 dark:text-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isLogin ? '콘솔로 이동' : '로그인'}
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
