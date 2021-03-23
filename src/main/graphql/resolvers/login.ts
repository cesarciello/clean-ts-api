import { adaptResover } from '@/main/adapter/apollo'
import { makeLoginController } from '@/main/factories/controllers/login'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResover(makeLoginController(), args)
  }
}
