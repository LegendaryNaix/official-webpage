import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Guard, PUBLIC_KEY, ROLES_KEY } from '@libs/decorator'
import { ForbiddenException } from '@libs/exception'
import { AccountStatus, Role } from '@prisma/client'
import type { AuthenticatedRequest } from '../authenticated-request.interface'
import { RolesService } from './roles.service'

@Guard()
export class RolesGuard implements CanActivate {
  #rolesHierarchy = {}

  constructor(
    private readonly reflector: Reflector,
    private readonly service: RolesService
  ) {
    Object.keys(Role).forEach((key, index) => {
      this.#rolesHierarchy[key] = index
    })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest()

    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    const role =
      this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ]) ?? Role.User

    const user = request.user

    if (!user.role || !user.status) {
      const result = await this.service.getUserRoleAndStatus(user.id)
      user.role = result.role
      user.status = result.status
    }

    if (
      this.#rolesHierarchy[user.role] >= this.#rolesHierarchy[role] &&
      user.status === AccountStatus.Enable
    ) {
      return true
    }

    console.log(request.url)

    if (user && request.url === '/api/user') {
      return true
    }

    throw new ForbiddenException('접근 권한이 없습니다')
  }
}
