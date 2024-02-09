import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Guard, ROLES_KEY } from '@libs/decorator'
import { ForbiddenException } from '@libs/exception'
import { Role } from '@prisma/client'
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
    try {
      let request: AuthenticatedRequest

      const role =
        this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
          context.getHandler(),
          context.getClass()
        ]) ?? Role.User

      const user = request.user

      if (!user.role) {
        const userRole = (await this.service.getUserRole(user.id)).role
        user.role = userRole
      }

      if (this.#rolesHierarchy[user.role] >= this.#rolesHierarchy[role]) {
        return true
      }

      return false
    } catch (error) {
      throw new ForbiddenException('접근 권한이 없습니다')
    }
  }
}
