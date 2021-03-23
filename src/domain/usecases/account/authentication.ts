import { AuthenticationModel } from '@/domain/models/authentication'

export interface Authentication {
  auth: (authenticationData: Authentication.Params) => Promise<Authentication.Result>
}
export namespace Authentication {
  export type Params = {
    email: string
    password: string
  }

  export type Result = AuthenticationModel
}
