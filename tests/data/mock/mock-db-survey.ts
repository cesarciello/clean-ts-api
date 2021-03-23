import { SurveyModel } from '@/domain/models/survey'
import { AddSurvey } from '@/domain/usecases/survey'
import { mockSurveyModel, mockSurveyModelList } from '../../domain/mock'
import { LoadSurveysRepository, LoadSurveyByIdRepository, AddSurveyRepository } from '@/data/protocols/db/survey'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurvey.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(): Promise<LoadSurveyByIdRepository.Result> {
      return Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModelList())
    }
  }
  return new LoadSurveysRepositoryStub()
}
