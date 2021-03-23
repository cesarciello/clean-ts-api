import { ObjectId } from 'mongodb'
import { QueryBuilder, MongoHelper } from '../helpers'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, CheckSurveyByIdRepository } from '@/data/protocols/db/survey'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, CheckSurveyByIdRepository {
  async add(surveyData: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResult',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      })
      .build()
    const surveys = await surveyCollection.aggregate(query).toArray()
    return MongoHelper.mapCollection(surveys)
  }

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }

  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const survey = await surveyCollection.countDocuments({ _id: new ObjectId(id) })
    return survey >= 1
  }
}
