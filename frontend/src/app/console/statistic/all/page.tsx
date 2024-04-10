import AttendanceRangeForm from './_components/AttendanceRangeForm'

export default function AttendanceStatisticAllPage() {
  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-start">
      <div className="mt-4 flex w-full flex-col justify-between space-y-5 px-4 text-left sm:px-6">
        <h1 className="text-base font-bold sm:text-xl">전체 출석통계</h1>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-4">
            <AttendanceRangeForm />
          </div>
        </div>
      </div>
    </main>
  )
}
