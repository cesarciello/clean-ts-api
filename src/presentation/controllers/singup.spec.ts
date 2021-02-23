import { SignUpController } from './singup'

describe('SingUp Controller', () => {
  test('should return 400 is no name is provide', () => {
    const sut = new SignUpController()
    const httpRequest = {
      email: 'any_password',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    }
    const httpResponde = sut.handle(httpRequest)
    expect(httpResponde.statusCode).toBe(400)
  })
})
