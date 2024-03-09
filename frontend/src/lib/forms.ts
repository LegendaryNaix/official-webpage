import { z } from 'zod'
import { RosterStatus, RosterType } from './enums'

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
  }),
  type: z.nativeEnum(RosterType),
  status: z.nativeEnum(RosterStatus),
  registerYear: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine(
      (val) => {
        return val >= 1957 && val <= new Date().getFullYear()
      },
      {
        message: '입부년도는 1957년보다 크고 현재년도보다 작아야합니다'
      }
    ),
  admissionYear: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine(
      (val) => {
        return val >= 1950 && val <= new Date().getFullYear()
      },
      {
        message: '입학년도는 1950년보다 크고 현재년도보다 작아야합니다'
      }
    ),
  class: z.string(),
  target: z.boolean(),
  offPosition: z
    .string()
    .optional()
    .refine(
      (val) => {
        return val === undefined || ['QB', 'OL', 'RB', 'WR', 'TE'].includes(val)
      },
      {
        message:
          '오펜스 포지션은 QB, OL, RB, WR, TE 중에 하나의 값이어야 합니다'
      }
    ),
  defPosition: z
    .string()
    .optional()
    .refine(
      (val) => {
        return val === undefined || ['DL', 'LB', 'HYB', 'DB'].includes(val)
      },
      {
        message: '디펜스 포지션은 DL, LB, HYB, DB 중에 하나의 값이어야 합니다'
      }
    ),
  splPosition: z
    .string()
    .optional()
    .refine(
      (val) => {
        return val === undefined || ['S', 'K', 'H', 'P'].includes(val)
      },
      {
        message: '디펜스 포지션은 S, K, H, P 중에 하나의 값이어야 합니다'
      }
    )
})
