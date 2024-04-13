'use client'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FetchError } from '@/lib/error'
import fetcher from '@/lib/fetcher'
import { Label } from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Submit {
  [key: string]: number
}

export default function QuizSection({
  answers,
  studentId
}: {
  answers: number[]
  studentId: string
}) {
  const [current, setCurrent] = useState(0)
  const [submits, setSubmits] = useState<Submit>({
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': 0
  })
  const [api, setApi] = useState<CarouselApi>()

  const router = useRouter()

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const handleNextClick = () => {
    if (!api) {
      return
    }

    // eslint-disable-next-line
    if (submits[current.toString()] === 0) {
      toast.error('정답을 선택하지 않았습니다')
    } else {
      api.scrollNext()
    }
  }

  const handleSubmit = async () => {
    if (submits[10] === 0) {
      toast.error('정답을 선택하지 않았습니다')
      return
    }

    let score = 0

    answers.forEach((answer, index) => {
      if (submits[(index + 1).toString()] === answer) score += 1
    })

    try {
      await fetcher.post(
        '/quiz',
        {
          studentId,
          score: score * 10
        },
        false
      )

      router.push('/quiz/result?score=' + score * 10)
      router.refresh()
    } catch (error) {
      if (error instanceof FetchError) {
        toast.error(error.message)
      } else {
        toast.error('퀴즈를 제출하지 못했습니다')
      }
    }
  }

  const quizes = [
    {
      question: '다음 중 성균관대학교 미식축구부 로얄스의 창단년도는?',
      1: '1957년',
      2: '1958년',
      3: '1959년',
      4: '1960년'
    },
    {
      question: '다음 중 1부가에 등장하지 않는 단어는?',
      1: '미팅',
      2: '공부',
      3: '샷건',
      4: '쌍권총'
    },
    {
      question:
        '다음 중 공기밥 또는 라면사리를 한 번 이상 무료로 추가할 수 없는 음식점은?',
      1: '마돌',
      2: '찌개지존',
      3: '소한마리 정육식당',
      4: '준호네 부대찌개'
    },
    {
      question:
        '다음 중 성균관대학교 미식축구부가 처음으로 시범경기를 한 상대팀은?',
      1: '고려대학교',
      2: '보인상고',
      3: '미군부대',
      4: '서울대학교'
    },
    {
      question: '다음 중 성격이 다른 단어는?',
      1: '백종원',
      2: '회오리감자',
      3: '동아치',
      4: '생선장수'
    },
    {
      question: '다음 중 주장을 역임하지 않은 사람은?',
      1: '이용욱',
      2: '홍재황',
      3: '양승엽',
      4: '육승태'
    },
    {
      question:
        '다음 중 성균관대 미식축구부 로얄스가 창단에 관여한 단체 또는 학교 팀이 아닌 것은?',
      1: '대구한의대 미식축구부',
      2: 'CAPS(현 골든이글스)',
      3: '부산대 미식축구부',
      4: '동아대 미식축구부'
    },
    {
      question: '다음 중 스태프 팀이 19" 이후에 만들지 않은 굿즈는?',
      1: '스티커',
      2: '팔찌',
      3: '키링',
      4: '폰케이스'
    },
    {
      question:
        '다음 중 성균관대 미식축구부 로얄스와 사진 또는 영상을 찍은 적이 없는 사람 또는 단체는?',
      1: '박보영',
      2: 'NCT',
      3: '신동렬',
      4: '트와이스'
    },
    {
      question: '다음 중 두 번째로 비싼 것은?',
      1: '스피드 플렉스 헬멧',
      2: '피칭머신',
      3: '허들 1년 사용료',
      4: '지관 한 학기 기숙사비(0식)'
    }
  ]

  return (
    <Carousel setApi={setApi}>
      <p className="mb-5 text-center text-amber-400">총 10개중 {current}번째</p>
      <CarouselContent className="max-w-[280px]">
        {quizes.map((quiz, index) => {
          return (
            <CarouselItem className="flex flex-col" key={index}>
              <h2 className="mb-5 text-base font-semibold">
                #{index + 1} {quiz.question}
              </h2>
              <RadioGroup
                onValueChange={(value) =>
                  setSubmits({
                    ...submits,
                    [(index + 1).toString()]: parseInt(value, 10)
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" />
                  <Label>1. {quiz[1]}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" />
                  <Label>2. {quiz[2]}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" />
                  <Label>3. {quiz[3]}</Label>
                </div>
                <div className="mb-3 flex items-center space-x-2">
                  <RadioGroupItem value="4" />
                  <Label>4. {quiz[4]}</Label>
                </div>
                {index === 9 && (
                  <Button variant="accent" onClick={() => handleSubmit()}>
                    결과 확인
                  </Button>
                )}
              </RadioGroup>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious disabled={current === 1} />
      <CarouselNext
        disabled={current === 10}
        onClick={() => handleNextClick()}
      />
    </Carousel>
  )
}
