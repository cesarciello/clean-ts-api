import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecases', () => {
  test('should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt(password: string): Promise<string> {
        return new Promise(resolve => resolve('encrypted_password'))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
})
