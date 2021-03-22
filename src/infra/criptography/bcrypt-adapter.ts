import bcrypt from 'bcrypt'
import { Hasher, HashComparer } from '@/data/protocols/criptography'

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
