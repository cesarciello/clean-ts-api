import { Controller } from '@/presentation/protocols'
import { makeAddSuveyValidation } from './add-survey-validation-factory'
import { makeDbAddSurvey } from '@/main/factories/usecases/survey'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { AddSurveyController } from '@/presentation/controllers/survey'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSuveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}
