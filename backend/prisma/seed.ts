import { PrismaClient, type Prisma, Role, AccountStatus } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

const createAccounts = async () => {
  const accounts: Prisma.UserCreateManyInput[] = [
    {
      username: 'user01',
      email: 'user01@example.com',
      nickname: 'user01',
      password: await hash('royals@1234'),
      role: Role.User,
      status: AccountStatus.Enable
    },
    {
      username: 'manager01',
      email: 'manager01@example.com',
      nickname: 'manager01',
      password: await hash('royals@1234'),
      role: Role.Manager,
      status: AccountStatus.Enable
    },
    {
      username: 'admin01',
      email: 'admin01@example.com',
      nickname: 'admin01',
      password: await hash('royals@1234'),
      role: Role.Admin,
      status: AccountStatus.Enable
    }
  ]

  await prisma.user.createMany({
    data: accounts
  })
}

const main = async () => {
  await createAccounts()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
