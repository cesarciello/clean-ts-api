import { AccountModel } from '../../domain/models/account'
import { AddAccountModel } from '../../domain/usescases/add-account'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
