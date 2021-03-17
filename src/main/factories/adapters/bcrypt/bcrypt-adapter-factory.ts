import { Hasher } from '@/data/protocols/criptography/hasher'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { BCryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'

export const makeBcryptAdapter = (): Hasher & HashComparer => {
  const salt = 12
  return new BCryptAdapter(salt)
}
