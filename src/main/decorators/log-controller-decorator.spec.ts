import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { AccountModel } from '../../domain/models/account'
import { okRequest, serverError } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpResponse, HttpResquest } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    email: 'valid_email@email.com',
    name: 'valid_name',
    password: 'valid_password'
  }
)

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(okRequest(makeFakeAccount())))
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

const makeFakeRequest = (): HttpResquest => (
  {
    body: {
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
)

const makeFakeReponseError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  const error = serverError(fakeError)
  return error
}

describe('Log Controller Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return the same result of the controller handle', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(okRequest(makeFakeAccount()))
  })

  test('should call LogErrorRepository with correct error if controller returns server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const error = makeFakeReponseError()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
