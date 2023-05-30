import { IsOptional, IsString, IsTaxId } from 'class-validator';

export class AnswersDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  action_or_slow?: string;

  @IsString()
  @IsOptional()
  comedey_or_thriller?: string;

  @IsString()
  @IsOptional()
  true_story_or_fiction?: string;

  @IsString()
  @IsOptional()
  specific_time_period_or_cultural_background?: string;
}
