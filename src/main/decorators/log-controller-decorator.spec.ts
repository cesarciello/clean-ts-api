import { mockAccountModel, mockAddAccountWithConfirmationParams } from '@/domain/test'
import { mockLogErrorRepository } from '@/data/test/mock-db-log'
import { LogControllerDecorator } from './log-controller-decorator'
import { okRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { Controller, HttpResponse, HttpResquest } from '@/presentation/protocols'

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(okRequest(mockAccountModel())))
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

const mockRequest = (): HttpResquest => ({ body: mockAddAccountWithConfirmationParams() })

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
    await sut.handle(mockRequest())
    expect(handleSpy).toHaveBeenCalledWith(mockRequest())
  })

  test('should return the same result of the controller handle', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(okRequest(mockAccountModel()))
  })

  test('should call LogErrorRepository with correct error if controller returns server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const error = makeFakeReponseError()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(error)
    await sut.handle(mockRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
