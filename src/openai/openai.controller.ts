import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { AnswersDto } from './dtos/answers.dto';

@Controller('openai')
export class OpenaiController {
  constructor(private openAIService: OpenaiService) {}

  @Post('/list')
  listMovies(@Body() answers: AnswersDto) {
    return this.openAIService.listMovies(answers);
  }
}
