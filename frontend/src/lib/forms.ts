import { z } from 'zod'

export const LoginFormSchema = z.object({
  username: z.string().min(2, {
    message: '필수 입력 사항입니다'
  }),
  password: z.string().min(2, {
    message: '필수 입력 사항입니다'
  })
})
