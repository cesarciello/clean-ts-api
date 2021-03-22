import { Controller } from '@/presentation/protocols'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey-result'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-decorator-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(saveSurveyResultController)
}
