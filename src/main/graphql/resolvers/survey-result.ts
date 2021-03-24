import { adaptResover } from '@/main/adapter/apollo'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result'

export default {
  Query: {
    surveyResult: async (parent: any, args: any) => adaptResover(makeLoadSurveyResultController(), args)
  },
  Mutation: {
    saveSurveyResult: async (parent: any, args: any) => adaptResover(makeSaveSurveyResultController(), args)
  }
}
