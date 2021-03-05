import { Hasher } from '../../data/protocols/criptograpy/hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../data/protocols/criptograpy/hash-comparer'

export class BCryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async compare(valeu: string, hash: string): Promise<boolean> {
    const compareResult = await bcrypt.compare(valeu, hash)
    return compareResult
  }

  async hash(value: string): Promise<string> {
    const hashValue = await bcrypt.hash(value, this.salt)
    return hashValue
  }
}
