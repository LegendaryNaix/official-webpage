import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class QuizScoreDTO {
  @IsString()
  @IsNotEmpty()
  studentId: string

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  score: number
}
