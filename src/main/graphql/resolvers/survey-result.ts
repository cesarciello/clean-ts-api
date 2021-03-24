import { adaptResover } from '@/main/adapter/apollo'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result'

export default {
  Query: {
    surveyResult: async (parent: any, args: any, context: any) => adaptResover(makeLoadSurveyResultController(), args, context)
  },
  Mutation: {
    saveSurveyResult: async (parent: any, args: any, context: any) => adaptResover(makeSaveSurveyResultController(), args, context)
  }
}
