import { BCryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { Hasher } from '../../../../data/protocols/criptograpy/hasher'
import { HashComparer } from '../../../../data/protocols/criptograpy/hash-comparer'

export const makeBcryptAdapter = (): Hasher & HashComparer => {
  const salt = 12
  return new BCryptAdapter(salt)
}
