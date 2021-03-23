import { AddAccount } from '@/domain/usecases/account/add-account'
import { Authentication } from '@/domain/usecases/account/authentication'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccount.Params): Promise<AddAccount.Result> {
      return Promise.resolve(true)
    }
  }
  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authenticationData: Authentication.Params): Promise<Authentication.Result> {
      return Promise.resolve({ accessToken: 'any_token', name: 'any_name' })
    }
  }
  return new AuthenticationStub()
}
