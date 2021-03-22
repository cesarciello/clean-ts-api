import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-decorator-factory'
import { makeDbLoadSurveys } from '@/main/factories/usecases/survey'
import { LoadSurveysController } from '@/presentation/controllers/survey'

export const makeLoadSurveysController = (): Controller => {
  const addSurveyController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(addSurveyController)
}
