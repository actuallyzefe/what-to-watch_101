import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { AnswersDto } from './dtos/answers.dto';

export const cleanSpacings = (text: string) => {
  return text.replace(/(\r\n|\n|\r)/gm, '');
};

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async listMovies(answers: AnswersDto) {
    try {
      const category = answers.category
        ? `category: ${answers.category},\n`
        : '';
      const action_or_slow = answers.action_or_slow
        ? `action_or_slow: ${answers.action_or_slow}, \n`
        : '';
      const comedy_or_thriller = answers.comedey_or_thriller
        ? `Comedy Or Thriller: ${answers.comedey_or_thriller}, \n`
        : '';
      const true_story_or_fiction = answers.true_story_or_fiction
        ? `TrueStory or Fiction: ${answers.true_story_or_fiction}, \n`
        : '';
      const specific_time_period_or_cultural_background =
        answers.specific_time_period_or_cultural_background
          ? `InterestedInTheCulture: ${answers.specific_time_period_or_cultural_background}, \n`
          : '';

      const prompt = `Bana bu belirttiğim değerleri gözönünde bulundurarak 50 adet film öner.
        1 - En sevdiğiniz film türü hangisidir? Cevap: ${category}.
        2 - Aksiyon dolu filmler mi yoksa daha yavaş tempolu olanlar mı size daha çok ilgi çeker? Cevap: ${action_or_slow}.
        3 - Hafif komediler mi yoksa sürükleyici gerilim filmleri mi izlemek istersiniz? Cevap: ${comedy_or_thriller}.
        4 - Gerçek hikayelere dayanan filmler mi yoksa tamamen kurgusal anlatımlara sahip olanlar mı size daha çok ilgi çeker? Cevap: ${true_story_or_fiction}.
        5 - Belirli bir döneme veya kültürel arka plana sahip filmleri keşfetmek ister misiniz? Cevap: ${specific_time_period_or_cultural_background}.
        Lütfen IMDB puanı yüksek filmlerden öneri yap
        Cevapları SADECE FİLM ADLARYILA YAP VE ARALARINI  "-" İLE AYIR IMDB PUANLARINI GOSTER VE IMDB PUANLARINA GÖRE SIRALAMIŞ OL
        `;

      const response = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        temperature: 1,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      let moviesArray = [];
      const moviesResponse = response.data.choices[0].text;
      const movies = moviesResponse.split('-');
      moviesArray.push(movies);

      return movies;
      return;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Handle rate limit exceeded error
        const retryAfter = error.response.headers['retry-after'];
        console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
      } else {
        console.error('An error occurred:', error);
      }
    }
  }
}
