import { AccountModel } from '@/domain/models/account'
import { AddAccount, AuthenticationParams } from '@/domain/usecases/account'

export const mockAccountModel = (): AccountModel => (
  {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  }
)

export const mockAddAccountParams = (): AddAccount.Params => (
  {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
)

export const mockAddAccountWithConfirmationParams = (): AddAccount.Params & { passwordConfirmation: string } => (
  {
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
)

export const mockAddAccountWitkTokenParams = (): AddAccount.Params & { accessToken: string } => (
  {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    accessToken: 'any_token'
  }
)

export const mockAddAccountWitkTokenAndRoleParams = (): AddAccount.Params & { accessToken: string, role: string } => (
  {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    accessToken: 'any_token',
    role: 'admin'
  }
)

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})
