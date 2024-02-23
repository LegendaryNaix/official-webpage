'use client'

import { auth } from '@/lib/auth'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const navigation = [
  { name: 'Roster', href: '#' },
  { name: 'Schedule', href: '#' },
  { name: 'Board', href: '#' },
  { name: 'About Us', href: '#' }
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
    <header className="fixed left-0 top-0 z-10 w-full bg-transparent backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">SKKU ROYALS</span>
          <Image
            className="h-8 w-auto"
            src="/logo.png"
            alt="ROYALS"
            width={1312}
            height={800}
          />
        </Link>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-50"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-50"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href={isLogin ? '/console' : '/login'}
            className="text-sm font-semibold leading-6 text-gray-50"
          >
            {isLogin ? '콘솔로 이동' : 'Log in'}{' '}
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
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 backdrop-blur-md sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">SKKU ROYALS</span>
              <Image
                className="h-8 w-auto"
                src="/logo.png"
                alt="ROYALS"
                width={1312}
                height={800}
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y-2 divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-50 hover:bg-gray-400 hover:text-gray-950"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href={isLogin ? '/console' : '/login'}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-50 hover:bg-gray-400 hover:text-gray-950"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isLogin ? '콘솔로 이동' : 'Log in'}
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
