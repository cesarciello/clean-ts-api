import { AddAccountRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository, LoadAccountByEmailRepository, CheckAccountByEmailRepository } from '@/data/protocols/db/account'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
      return Promise.resolve(true)
    }
  }

  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (config?: { noResponse?: boolean }): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result> {
      let account: LoadAccountByEmailRepository.Result = {
        id: 'any_id',
        name: 'any_name',
        password: 'hash_password'
      }
      if (config?.noResponse) {
        account = null
      }
      return Promise.resolve(account)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockCheckAccountByEmailRepository = (): CheckAccountByEmailRepository => {
  class CheckcountByEmailRepositoryStub implements CheckAccountByEmailRepository {
    async checkByEmail(email: string): Promise<CheckAccountByEmailRepository.Result> {
      return Promise.resolve(false)
    }
  }
  return new CheckcountByEmailRepositoryStub()
}

export const mockAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
      return Promise.resolve({ id: 'any_id' })
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}
