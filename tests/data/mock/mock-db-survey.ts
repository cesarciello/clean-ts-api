import { mockSurveyModel, mockSurveyModelList } from '../../domain/mock'
import { LoadSurveysRepository, LoadSurveyByIdRepository, AddSurveyRepository, LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyRepository.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
      return Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadAnswersBySurveyRepository = (): LoadAnswersBySurveyRepository => {
  class LoadAnswersBySurveyRepositoryStub implements LoadAnswersBySurveyRepository {
    async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
      return Promise.resolve(['any_answer', 'other_answer'])
    }
  }
  return new LoadAnswersBySurveyRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(accountId: string): Promise<LoadSurveysRepository.Result> {
      return Promise.resolve(mockSurveyModelList())
    }
  }
  return new LoadSurveysRepositoryStub()
}
