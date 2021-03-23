import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModelList } from '../../domain/mock'
import { AddSurvey, LoadSurveyById, LoadSurveys } from '@/domain/usecases/survey'

export const mockAddSurvey = (): any => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurvey.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

export const mockLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModelList())
    }
  }
  return new LoadSurveysStub()
}
