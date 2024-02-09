import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import { RolesGuard } from '@libs/auth'
import type { Role } from '@prisma/client'

export const PUBLIC_KEY = 'public'
export const ROLES_KEY = 'role'

export const Roles = (role: Role) => {
  return applyDecorators(SetMetadata(ROLES_KEY, role), UseGuards(RolesGuard))
}

export const Public = () => SetMetadata(PUBLIC_KEY, true)
