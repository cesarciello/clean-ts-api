import { Controller } from '@/presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '@/presentation/controllers/login'
import { makeDbAuthentication } from '@/main/factories/usecases/account'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
