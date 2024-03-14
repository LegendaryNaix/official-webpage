import {
  PrismaClient,
  type Prisma,
  Role,
  AccountStatus,
  RosterStatus,
  RosterType,
  ScheduleType
} from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

const seedingDatabase = async () => {
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
      type: RosterType.Staff
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

  const surveyGroups: Prisma.SurveyGroupCreateManyInput[] = [
    {
      name: '1주차 출석조사',
      startedAt: new Date('2024-01-01T01:00:00.000Z'),
      endedAt: new Date('2024-01-03T11:00:00.000Z'),
      required: true
    },
    {
      name: '2주차 출석조사',
      startedAt: new Date('2024-01-08T01:00:00.000Z'),
      endedAt: new Date('2024-01-10T11:00:00.000Z'),
      required: true
    },
    {
      name: '3주차 출석조사',
      startedAt: new Date('2024-02-01T01:00:00.000Z'),
      endedAt: new Date('2024-02-03T11:00:00.000Z'),
      required: false
    },
    {
      name: '4주차 출석조사',
      startedAt: new Date('2024-03-01T01:00:00.000Z'),
      endedAt: new Date('2024-03-03T11:00:00.000Z'),
      required: true
    },
    {
      name: '5주차 출석조사',
      startedAt: new Date('2024-03-05T01:00:00.000Z'),
      endedAt: new Date('2024-03-15T11:00:00.000Z'),
      required: true
    },
    {
      name: '6주차 출석조사',
      startedAt: new Date('2024-03-25T01:00:00.000Z'),
      endedAt: new Date('2024-03-28T11:00:00.000Z'),
      required: true
    }
  ]

  await prisma.surveyGroup.createMany({
    data: surveyGroups
  })

  const schedules: Prisma.ScheduleCreateManyInput[] = [
    {
      name: '월요일 캠퍼스별 훈련',
      description: '월요일 캠퍼스별 훈련',
      surveyGroupId: 1,
      startedAt: new Date('2024-01-01T08:00:00.000Z'),
      endedAt: new Date('2024-01-01T11:00:00.000Z'),
      type: ScheduleType.SeperatedExercise
    },
    {
      name: '수요일 캠퍼스별 훈련',
      description: '수요일 캠퍼스별 훈련',
      surveyGroupId: 1,
      startedAt: new Date('2024-01-03T08:00:00.000Z'),
      endedAt: new Date('2024-01-03T11:00:00.000Z'),
      type: ScheduleType.SeperatedExercise
    },
    {
      name: '금요일 통합훈련',
      description: '금요일 통합훈련',
      surveyGroupId: 1,
      startedAt: new Date('2024-01-05T08:00:00.000Z'),
      endedAt: new Date('2024-01-05T11:00:00.000Z'),
      type: ScheduleType.IntegratedExercise
    },
    {
      name: '토요일 통합훈련',
      description: '토요일 통합훈련',
      surveyGroupId: 1,
      startedAt: new Date('2024-01-05T23:00:00.000Z'),
      endedAt: new Date('2024-01-06T02:00:00.000Z'),
      type: ScheduleType.IntegratedExercise
    }
  ]

  await prisma.schedule.createMany({
    data: schedules
  })

  const attendances: Prisma.AttendanceCreateManyInput[] = [
    {
      scheduleId: 1,
      rosterId: 1,
      response: 'Present'
    },
    {
      scheduleId: 1,
      rosterId: 2,
      response: 'Present'
    },
    {
      scheduleId: 1,
      rosterId: 3,
      response: 'Present'
    },
    {
      scheduleId: 1,
      rosterId: 5,
      response: 'Tardy',
      reason: '수업'
    },
    {
      scheduleId: 1,
      rosterId: 6,
      response: 'Tardy',
      reason: '수업'
    },
    {
      scheduleId: 1,
      rosterId: 7,
      response: 'Absence',
      reason: '수업'
    },
    {
      scheduleId: 1,
      rosterId: 9,
      response: 'Present'
    },
    {
      scheduleId: 1,
      rosterId: 9,
      response: 'Absence',
      reason: '수업'
    }
  ]

  await prisma.attendance.createMany({
    data: attendances
  })
}

const main = async () => {
  await seedingDatabase()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
