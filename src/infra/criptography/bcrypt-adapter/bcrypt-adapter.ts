import bcrypt from 'bcrypt'
import { Hasher } from '@/data/protocols/criptograpy/hasher'
import { HashComparer } from '@/data/protocols/criptograpy/hash-comparer'

export class BCryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) { }

  async compare(valeu: string, hash: string): Promise<boolean> {
    const compareResult = await bcrypt.compare(valeu, hash)
    return compareResult
  }

  async hash(value: string): Promise<string> {
    const hashValue = await bcrypt.hash(value, this.salt)
    return hashValue
  }
}
