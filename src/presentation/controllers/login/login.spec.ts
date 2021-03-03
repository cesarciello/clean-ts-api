import { MissingParamError } from '../../errors'
import { badResquest } from '../../helpers/http-helper'
import { HttpResquest } from '../../protocols'
import { LoginController } from './login'

const makeAccountRequest = (): HttpResquest => (
  {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }
)

const makeSut = (): LoginController => {
  return new LoginController()
}

describe('LoginContorller', () => {
  test('should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest = makeAccountRequest()
    delete httpRequest.body.email
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badResquest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const sut = makeSut()
    const httpRequest = makeAccountRequest()
    delete httpRequest.body.password
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badResquest(new MissingParamError('password')))
  })
})
