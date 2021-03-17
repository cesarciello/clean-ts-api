import { AccountModel } from '../../models/account'

export interface AddAccount {
  add: (account: AddAccountParams) => Promise<AccountModel>
}

export type AddAccountParams = {
  name: string
  email: string
  password: string
}
