'use client'

import { getCurrentUserProfile } from '@/lib/actions'
import { auth } from '@/lib/auth'
import type { UserProfile } from '@/lib/types/user'
import { Dialog, Transition } from '@headlessui/react'
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  EnvelopeIcon,
  FireIcon,
  HomeIcon,
  LinkIcon,
  PencilIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const navigation = [
  {
    name: '대시보드',
    href: '/console/dashboard',
    icon: HomeIcon,
    role: 'User'
  },
  {
    name: '건의사항',
    href: '/console/appeal',
    icon: EnvelopeIcon,
    role: 'User'
  },
  {
    name: '로스터연결',
    href: '/console/roster',
    icon: LinkIcon,
    role: 'User'
  },
  { name: '부원관리', href: '#', icon: UsersIcon, role: 'Manager' },
  { name: '시합관리', href: '#', icon: FireIcon, role: 'Manager' },
  { name: '일정관리', href: '#', icon: CalendarIcon, role: 'Manager' },
  { name: '계정관리', href: '/console/account', icon: UserIcon, role: 'Admin' },
  { name: '출석변경', href: '#', icon: PencilIcon, role: 'Admin' },
  { name: '출석통계', href: '#', icon: ChartPieIcon, role: 'Admin' }
]

export default function ConsoleSidebar() {
  const [allowedRoutes, setAllowedRoutes] = useState<
    {
      name: string
      href: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: any
      role: string
    }[]
  >([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile>()
  const pathname = usePathname()

  useEffect(() => {
    const getSession = async () => {
      const session = await auth()

      if (session?.user.role === 'Admin') {
        setAllowedRoutes(
          navigation.filter(
            (item) =>
              item.role === 'Admin' ||
              item.role === 'Manager' ||
              item.role === 'User'
          )
        )
      }
      if (session?.user.role === 'Manager') {
        setAllowedRoutes(
          navigation.filter(
            (item) => item.role === 'Manager' || item.role === 'User'
          )
        )
      }
      if (session?.user.role === 'User') {
        setAllowedRoutes(navigation.filter((item) => item.role === 'User'))
      }
    }

    getSession()
  }, [])

  useEffect(() => {
    const getProfile = async () => {
      const profile = await getCurrentUserProfile()
      setProfile(profile)
    }

    getProfile()
  }, [])

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <Image
                        className="h-6 w-6 object-cover"
                        src="/logo.png"
                        alt="Royals"
                        width={128}
                        height={128}
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {allowedRoutes.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={clsx(
                                    'group flex gap-x-3 rounded-md p-2 text-sm font-bold leading-6',
                                    {
                                      'text-amber-400': pathname.startsWith(
                                        item.href
                                      ),
                                      'text-gray-400 hover:bg-gray-800 hover:text-white':
                                        !pathname.startsWith(item.href)
                                    }
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <Link
                            href="/"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                          >
                            <ArrowRightStartOnRectangleIcon
                              className="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            콘솔 나가기
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <Image
                className="h-8 w-auto"
                src="/logo.png"
                alt="ROYALS"
                width={128}
                height={128}
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {allowedRoutes.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={clsx(
                            'group flex gap-x-3 rounded-md p-2 text-sm font-bold leading-6',
                            {
                              'text-amber-400': pathname.startsWith(item.href),
                              'text-gray-400 hover:bg-gray-800 hover:text-white':
                                !pathname.startsWith(item.href)
                            }
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <Link
                    href="/"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <ArrowRightStartOnRectangleIcon
                      className="h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    콘솔 나가기
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="fixed top-0 z-10 flex h-16 w-full shrink-0 items-center justify-end gap-x-4 border-b border-zinc-200 px-4 shadow-sm backdrop-blur-sm sm:gap-x-6 sm:px-6 lg:sticky lg:px-8 dark:border-zinc-800">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div
              className="h-6 w-px bg-zinc-200 lg:hidden dark:bg-zinc-800"
              aria-hidden="true"
            />

            <div className="flex flex-1 justify-end gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <ThemeToggle />
                <div
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200 dark:lg:bg-zinc-800"
                  aria-hidden="true"
                />
                <div className="flex items-center">
                  {profile && profile.profileImageUrl ? (
                    <Image
                      className="h-6 w-6 rounded-full object-cover"
                      src={profile.profileImageUrl}
                      alt="profile"
                      width={128}
                      height={128}
                    />
                  ) : (
                    <Image
                      className="h-6 w-6 object-cover"
                      src="/logo.png"
                      alt="profile"
                      width={128}
                      height={128}
                    />
                  )}
                  <span className="hidden lg:flex lg:items-center">
                    <span
                      className="ml-4 text-sm font-semibold leading-6 text-gray-950 dark:text-gray-50"
                      aria-hidden="true"
                    >
                      {profile && profile.username}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
