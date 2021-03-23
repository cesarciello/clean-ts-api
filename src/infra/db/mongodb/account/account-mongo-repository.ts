import { MongoHelper } from '../helpers/mongo-helper'
import { AccountModel } from '@/domain/models/account'
import { AddAccountRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository, LoadAccountByEmailRepository } from '@/data/protocols/db/account'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('account')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('account')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken(_id: string, accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.updateOne({ _id }, {
      $set: {
        accessToken
      }
    })
  }

  async loadByToken(accessToken: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('account')
    const account = await accountCollection.findOne({ accessToken, $or: [{ role }, { role: 'admin' }] })
    return account && MongoHelper.map(account)
  }
}
