import { Controller } from '@/presentation/protocols'
import { makeSingupValidation } from './sigup-validation-factory'
import { SignUpController } from '@/presentation/controllers/login'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbAddAccount, makeDbAuthentication } from '@/main/factories/usecases/account'

export const makeSingupController = (): Controller => {
  const singupController = new SignUpController(makeDbAddAccount(), makeSingupValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(singupController)
}
