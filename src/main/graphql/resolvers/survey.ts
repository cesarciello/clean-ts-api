import { adaptResover } from '@/main/adapter/apollo'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey'

export default {
  Query: {
    surveys: async () => adaptResover(makeLoadSurveysController())
  }
}
