import { adaptResover } from '@/main/adapter/apollo'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey'

export default {
  Query: {
    surveys: async (parent: any, args: any, context: any) => adaptResover(makeLoadSurveysController(), null, context)
  }
}
