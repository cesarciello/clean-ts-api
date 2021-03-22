import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result'

export const makeLoadSurveyResultController = (): LoadSurveyResultController => {
  return new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
}
