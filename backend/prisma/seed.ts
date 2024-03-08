import {
  PrismaClient,
  type Prisma,
  Role,
  AccountStatus,
  RosterStatus,
  RosterType
} from '@prisma/client'
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

  const rosters: Prisma.RosterCreateManyInput[] = [
    {
      name: 'athlete01',
      admissionYear: 2019,
      class: 'captain',
      registerYear: 2019,
      studentId: '2019310001',
      status: RosterStatus.Enable,
      type: RosterType.Athlete,
      backNumber: 1,
      offPosition: 'QB',
      defPosition: 'CB'
    },
    {
      name: 'athlete02',
      admissionYear: 2019,
      class: 'vice_captain',
      registerYear: 2020,
      studentId: '2019310002',
      status: RosterStatus.Enable,
      type: RosterType.Athlete,
      backNumber: 2,
      offPosition: 'OL',
      defPosition: 'DL'
    },
    {
      name: 'athlete03',
      admissionYear: 2020,
      class: 'none',
      registerYear: 2022,
      studentId: '2020310001',
      status: RosterStatus.Enable,
      type: RosterType.Athlete,
      backNumber: 3,
      offPosition: 'RB',
      defPosition: 'LB'
    },
    {
      name: 'athlete04',
      admissionYear: 2023,
      class: 'none',
      registerYear: 2023,
      studentId: '2023310001',
      status: RosterStatus.Military,
      type: RosterType.Athlete,
      backNumber: 4,
      offPosition: 'RB',
      defPosition: 'LB'
    },
    {
      name: 'athlete05',
      admissionYear: 2023,
      class: 'none',
      registerYear: 2023,
      studentId: '2023310002',
      status: RosterStatus.Enable,
      type: RosterType.Athlete,
      backNumber: 5,
      offPosition: 'RB',
      defPosition: 'LB'
    },
    {
      name: 'athlete06',
      admissionYear: 2023,
      class: 'none',
      registerYear: 2023,
      studentId: '2023310003',
      status: RosterStatus.Enable,
      type: RosterType.Athlete,
      backNumber: 6,
      offPosition: 'RB',
      defPosition: 'LB'
    },
    {
      name: 'athlete07',
      admissionYear: 2023,
      class: 'none',
      registerYear: 2023,
      studentId: '2023310004',
      status: RosterStatus.Enable,
      type: RosterType.Athlete,
      backNumber: 7,
      offPosition: 'RB',
      defPosition: 'LB'
    },
    {
      name: 'athlete08',
      admissionYear: 2002,
      class: 'none',
      registerYear: 2002,
      studentId: '2002310001',
      status: RosterStatus.Alumni,
      type: RosterType.Athlete,
      backNumber: 15,
      offPosition: 'RB',
      defPosition: 'LB'
    },
    {
      name: 'staff01',
      admissionYear: 2019,
      class: 'staff captain',
      registerYear: 2019,
      studentId: '2019310003',
      status: RosterStatus.Enable,
      type: RosterType.Athlete
    },
    {
      name: 'staff02',
      admissionYear: 2023,
      class: 'none',
      registerYear: 2023,
      studentId: '2023310005',
      status: RosterStatus.Enable,
      type: RosterType.Staff
    },
    {
      name: 'coach01',
      admissionYear: 2014,
      class: 'Offence Cordinator',
      registerYear: 2014,
      studentId: '201401',
      status: RosterStatus.Enable,
      type: RosterType.Coach
    },
    {
      name: 'headCoach01',
      admissionYear: 2010,
      class: 'HeadCoach',
      registerYear: 2010,
      studentId: '201001',
      status: RosterStatus.Enable,
      type: RosterType.HeadCoach
    }
  ]

  await prisma.roster.createMany({
    data: rosters
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
