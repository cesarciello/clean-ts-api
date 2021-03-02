import { Controller, HttpResponse, HttpResquest } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('Log Controller Decorator', () => {
  test('should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
        const httpResponse = {
          statusCode: 200,
          body: {
            msg: 'Stub controller for tests'
          }
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpResquest)
    expect(handleSpy).toHaveBeenCalledWith(httpResquest)
  })
})
