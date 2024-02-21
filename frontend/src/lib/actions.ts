'use server'

import { signIn } from 'next-auth/react'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

export interface BasicState {
  errors?: object
  message?: string | null
}

/**
 * Login Form Action
 */

const LoginFormSchema = z.object({
  username: z.string(),
  password: z.string()
})

export interface LoginFormState extends BasicState {
  errors?: {
    username?: string[]
    password?: string[]
  }
}

export const loginAction = async (
  prevState: LoginFormState,
  formData: FormData
) => {
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password')
  })

  console.log(validatedFields)

  if (!validatedFields.success) {
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
      if (typeof window !== 'undefined') {
        toast.success('로그인 되었습니다')
      }
    } else {
      console.log(res.error)
      if (typeof window !== 'undefined') {
        toast.error('로그인 실패')
      }
    }
  } catch (error) {
    if (typeof window !== 'undefined') {
      toast.error('로그인 실패')
    }
  }

  revalidatePath('/')
  redirect('/')
}
