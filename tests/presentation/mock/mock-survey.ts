import { mockSurveyModel, mockSurveyModelList } from '../../domain/mock'
import { AddSurvey, CheckSurveyById, LoadAnswersBySurvey, LoadSurveys } from '@/domain/usecases/survey'

export const mockAddSurvey = (): any => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurvey.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}


export const mockLoadAnswersBySurveyStub = (): LoadAnswersBySurvey => {
  class LoadAnswersBySurveyStub implements LoadAnswersBySurvey {
    async loadAnswers(id: string): Promise<LoadAnswersBySurvey.Result> {
      return Promise.resolve(mockSurveyModel().answers.map(a => a.answer))
    }
  }
  return new LoadAnswersBySurveyStub()
}

export const mockCheckSurveyByIdStub = (): CheckSurveyById => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    async checkById(id: string): Promise<CheckSurveyById.Result> {
      return Promise.resolve(true)
    }
  }
  return new CheckSurveyByIdStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<LoadSurveys.Result> {
      return Promise.resolve(mockSurveyModelList())
    }
  }
  return new LoadSurveysStub()
}
