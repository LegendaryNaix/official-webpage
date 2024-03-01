import LocalTime from '@/components/Localtime'
import Section from '@/components/Section'
import { getCurrentUserProfile } from '@/lib/actions'
import type { UserProfile } from '@/lib/types/user'
import Image from 'next/image'
import { ProfileForm } from './ProfileForm'

export async function ProfileSection() {
  const profile: UserProfile = await getCurrentUserProfile()

  return (
    <Section title="내 정보" more={<ProfileForm profile={profile} />}>
      <div className="grid h-full grid-cols-3 gap-x-2 gap-y-5">
        <div className="col-span-3 flex items-center justify-center sm:col-span-1">
          {profile.profileImageUrl ? (
            <Image
              className="h-12 w-12 rounded-full object-cover sm:h-20 sm:w-20"
              src={profile.profileImageUrl}
              alt="profile"
              width={128}
              height={128}
            />
          ) : (
            <Image
              className="h-12 w-12 rounded-full object-cover sm:h-20 sm:w-20"
              src="/logo.png"
              alt="profile"
              width={128}
              height={128}
            />
          )}
        </div>
        <div className="col-span-3 flex h-full flex-col items-center justify-center space-y-1.5 sm:col-span-2 sm:items-start">
          <p className="text-xs text-zinc-400 sm:text-sm">
            아이디{' '}
            <span className="font-medium text-zinc-950 dark:text-zinc-50">
              {profile.username}
            </span>
          </p>
          <p className="text-xs text-zinc-400 sm:text-sm">
            닉네임{' '}
            <span className="font-medium text-zinc-950 dark:text-zinc-50">
              {profile.nickname}
            </span>
          </p>
          <p className="text-xs text-zinc-400 sm:text-sm">
            이메일{' '}
            <span className="font-medium text-zinc-950 dark:text-zinc-50">
              {profile.email}
            </span>
          </p>
          <p className="text-xs text-zinc-400 sm:text-sm">
            마지막 로그인{' '}
            <span className="font-medium text-zinc-950 dark:text-zinc-50">
              <LocalTime utc={profile.lastLogin} format="YYYY-MM-DD A hh:mm" />
            </span>
          </p>
        </div>
      </div>
    </Section>
  )
}
