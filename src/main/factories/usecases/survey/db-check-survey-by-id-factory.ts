import { DbCheckSurveyById } from '@/data/usecases/survey'
import { CheckSurveyById } from '@/domain/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey'

export const makeDbCheckSurveyById = (): CheckSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbCheckSurveyById(surveyMongoRepository)
}
