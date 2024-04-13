import { Body, Controller, Get, Post } from '@nestjs/common'
import { Public } from '@libs/decorator'
import { BusinessExceptionHandler } from '@libs/exception'
import { QuizScoreDTO } from './dto/quiz.dto'
import { QuizService } from './quiz.service'

@Public()
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getQuizRanks() {
    try {
      return await this.quizService.getQuizRank()
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Post()
  async registerQuizScore(@Body() quizDTO: QuizScoreDTO) {
    try {
      return await this.quizService.registerQuizScore(quizDTO)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }
}
