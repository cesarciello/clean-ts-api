import { adaptResover } from '@/main/adapter/apollo'
import { makeLoginController, makeSingupController } from '@/main/factories/controllers/login'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResover(makeLoginController(), args)
  },
  Mutation: {
    singUp: async (parent: any, args: any) => adaptResover(makeSingupController(), args)
  }
}
