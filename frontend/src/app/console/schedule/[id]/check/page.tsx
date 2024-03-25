import AttendanceCheckCarousel from './_components/AttendanceCheckCarousel'

export default function AttendanceCheckPage({
  params
}: {
  params: {
    id: number
  }
}) {
  return (
    <main className="mx-auto flex w-full flex-grow flex-col items-center justify-start">
      <div className="mt-4 flex w-full flex-col items-center px-4 sm:px-6">
        <AttendanceCheckCarousel params={params} />
      </div>
    </main>
  )
}
