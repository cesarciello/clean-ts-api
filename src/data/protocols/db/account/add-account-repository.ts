import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account'

export interface AddAccountRepository {
  add: (account: AddAccountParams) => Promise<AccountModel>
}
