import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAccountModel = (): AccountModel => (
  {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  }
)

export const mockAddAccountParams = (): AddAccountParams => (
  {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
)

export const mockAddAccountWithConfirmationParams = (): AddAccountParams & { passwordConfirmation: string } => (
  {
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
)

export const mockAddAccountWitkTokenParams = (): AddAccountParams & { accessToken: string } => (
  {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    accessToken: 'any_token'
  }
)

export const mockAddAccountWitkTokenAndRoleParams = (): AddAccountParams & { accessToken: string, role: string } => (
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
