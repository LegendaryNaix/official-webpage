export interface QuizScore {
  id: number
  score: number
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Roster: {
    name: string
    admissionYear: number
  }
}

export interface QuizRank {
  newbie: QuizScore[]
  senior: QuizScore[]
}
