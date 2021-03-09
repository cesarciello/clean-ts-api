import { Controller } from '../../../../presentation/protocols'
import { makeSingupValidation } from './sigup-validation-factory'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { SignUpController } from '../../../../presentation/controllers/singup/singup-controller'
import { makeLogControllerDecorator } from '../../decorators/log-decorator-factory'

export const makeSingupController = (): Controller => {
  const singupController = new SignUpController(makeDbAddAccount(), makeSingupValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(singupController)
}
