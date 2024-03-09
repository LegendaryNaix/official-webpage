import Section from '@/components/Section'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileSectionSkeleton() {
  return (
    <Section title="내 정보">
      <div className="grid h-full grid-cols-3 gap-x-2 gap-y-5">
        <div className="col-span-3 flex items-center justify-center sm:col-span-1">
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
        <div className="col-span-3 flex h-full flex-col items-center justify-center space-y-1.5 sm:col-span-2 sm:items-start">
          <Skeleton className="h-[14px] w-52 rounded-full" />
          <Skeleton className="h-[14px] w-52 rounded-full" />
          <Skeleton className="h-[14px] w-52 rounded-full" />
          <Skeleton className="h-[14px] w-52 rounded-full" />
        </div>
      </div>
    </Section>
  )
}
