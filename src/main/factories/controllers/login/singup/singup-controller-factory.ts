import { Controller } from '@/presentation/protocols'
import { makeSingupValidation } from './sigup-validation-factory'
import { SignUpController } from '@/presentation/controllers/login/singup/singup-controller'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-decorator-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'

export const makeSingupController = (): Controller => {
  const singupController = new SignUpController(makeDbAddAccount(), makeSingupValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(singupController)
}
