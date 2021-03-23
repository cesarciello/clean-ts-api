import { LoadSurveyResultController } from '@/presentation/controllers/survey-result'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result'
import { makeDbCheckSurveyById } from '../../usecases/survey/db-check-survey-by-id-factory'

export const makeLoadSurveyResultController = (): LoadSurveyResultController => {
  return new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult())
}
