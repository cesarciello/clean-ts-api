import { DbLoadAnswersBySurvey } from '@/data/usecases/survey'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey'

export const makeDbLoadSurveyById = (): LoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadAnswersBySurvey(surveyMongoRepository)
}
