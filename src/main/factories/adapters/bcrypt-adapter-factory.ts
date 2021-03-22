import { BCryptAdapter } from '@/infra/criptography'
import { Hasher, HashComparer } from '@/data/protocols/criptography'

export const makeBcryptAdapter = (): Hasher & HashComparer => {
  const salt = 12
  return new BCryptAdapter(salt)
}
