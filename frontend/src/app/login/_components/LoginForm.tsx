'use client'

import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { UserIcon, KeyIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const LoginFormSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

interface LoginFormState {
  errors?: {
    username?: string[]
    password?: string[]
  }
  message?: string | null
}

export default function LoginForm() {
  const [validationError, setValidationError] = useState(false)

  const loginAction = async (prevState: LoginFormState, formData: FormData) => {
    const validatedFields = LoginFormSchema.safeParse({
      username: formData.get('username'),
      password: formData.get('password')
    })

    if (!validatedFields.success) {
      setValidationError(true)
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: '입력하지 않은 필드가 존재합니다'
      }
    }

    try {
      const res = await signIn('credentials', {
        ...validatedFields.data,
        redirect: false
      })

      if (!res?.error) {
        toast.success('로그인 되었습니다')
        return { ...prevState, message: '로그인 되었습니다' }
      } else {
        console.log(res.error)
        toast.error('로그인 실패')
        return { ...prevState, message: '로그인 실패' }
      }
    } catch (error) {
      toast.error('로그인 실패')
      return { ...prevState, message: '로그인 실패' }
    }
  }

  const initState = { message: null, errors: {} }
  const [state, dispatch] = useFormState(loginAction, initState)

  return (
    <form action={dispatch} className="w-full">
      <div className="isolate -space-y-px rounded-md">
        <div
          className={clsx(
            'relative rounded-md rounded-b-none ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500',
            {
              'ring-red-600': state.errors?.username
            }
          )}
        >
          <label htmlFor="username" className="sr-only">
            username
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="username"
              id="username"
              className="block w-full border-0 bg-transparent py-2.5 pl-10 text-gray-50 placeholder:text-gray-50 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="아이디"
            />
            {state.errors?.username && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={clsx(
            'relative rounded-md rounded-t-none ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500',
            {
              'ring-red-600': state.errors?.password
            }
          )}
        >
          <label htmlFor="password" className="sr-only">
            password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="password"
              name="password"
              id="password"
              className="block w-full border-0 bg-transparent py-2.5 pl-10 text-gray-50 placeholder:text-gray-50 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="패스워드"
            />
            {state.errors?.password && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {validationError && (
        <p className="mt-1 text-xs text-red-600 sm:text-sm">
          입력되지 않은 필드가 존재합니다
        </p>
      )}
      <button
        className="mt-5 w-full rounded-md bg-amber-400 px-2 py-1.5 font-bold text-gray-950 shadow-sm hover:bg-amber-500 sm:text-sm sm:leading-6"
        type="submit"
      >
        로그인
      </button>
    </form>
  )
}
