import { Role, AccountStatus } from '@prisma/client'

export class AuthenticatedUser {
  #id: number
  #username: string
  #role: Role
  #status: AccountStatus

  constructor(id: number, username: string) {
    this.#id = id
    this.#username = username
  }

  get id() {
    return this.#id
  }

  get username() {
    return this.#username
  }

  get role() {
    return this.#role
  }

  get status() {
    return this.#status
  }

  set role(role) {
    this.#role = role
  }

  set status(status) {
    this.#status = status
  }

  isAdmin(): boolean {
    return this.#role === Role.Admin
  }

  isEnabled(): boolean {
    return this.#status !== AccountStatus.Enable
  }
}
