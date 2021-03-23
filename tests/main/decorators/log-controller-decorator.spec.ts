import { mockAccountModel } from '../../domain/mock'
import { mockLogErrorRepository } from '../../data/mock'
import { LogControllerDecorator } from '@/main/decorators'
import { LogErrorRepository } from '@/data/protocols/db/log'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { okRequest, serverError } from '@/presentation/helpers/http/http-helper'

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(resquest: any): Promise<HttpResponse> {
      return Promise.resolve(okRequest(mockAccountModel()))
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

const mockReponseError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  const error = serverError(fakeError)
  return error
}

describe('Log Controller Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle('any_request')
    expect(handleSpy).toHaveBeenCalledWith('any_request')
  })

  test('should return the same result of the controller handle', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle('any_request')
    expect(httpResponse).toEqual(okRequest(mockAccountModel()))
  })

  test('should call LogErrorRepository with correct error if controller returns server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const error = mockReponseError()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(error)
    await sut.handle('any_request')
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
