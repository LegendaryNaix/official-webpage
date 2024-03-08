import { z } from 'zod'

export const LoginFormSchema = z.object({
  username: z.string().min(1, {
    message: '필수 입력 사항입니다'
  }),
  password: z.string().min(1, {
    message: '필수 입력 사항입니다'
  })
})

export const AccountFormSchema = z.object({
  nickname: z.string().min(1, {
    message: '필수 입력 사항입니다'
  }),
  email: z
    .string()
    .min(1, {
      message: '필수 입력 사항입니다'
    })
    .email({
      message: '이메일 형식이 아닙니다'
    }),
  password: z.string().min(6, {
    message: '비밀번호는 최소 6글자 이상이어야 합니다'
  })
})

export const RosterFormSchema = z.object({
  id: z.number(),
  name: z.string().min(1, {
    message: '필수 입력 사항압니다'
  }),
  studentId: z.string().min(1, {
    message: '필수 입력 사항입니다'
  })
})
