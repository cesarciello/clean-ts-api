import { AddSurvey } from '@/domain/usecases/survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey'

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) { }

  async add(data: AddSurvey.Params): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
