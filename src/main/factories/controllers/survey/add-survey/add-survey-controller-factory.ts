import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-decorator-factory'
import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeAddSuveyValidation } from './add-survey-validation-factory'
import { makeDbAddSurvey } from '../../../usecases/survey/add-survey/db-add-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSuveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}
