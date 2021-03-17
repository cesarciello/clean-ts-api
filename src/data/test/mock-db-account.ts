import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AddAccountRepository } from '../protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return new Promise(resolve => resolve(mockAccountModel()))
    }
  }

  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (config?: { noResponse?: boolean }): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      let account: AccountModel = {
        id: 'any_id',
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'hash_password'
      }
      if (config?.noResponse) {
        account = null
      }
      return new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(mockAccountModel()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}
