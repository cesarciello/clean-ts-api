import { LogErrorRepository } from '@/data/protocols/db/log'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return Promise.resolve(null)
    }
  }
  return new LogErrorRepositoryStub()
}
