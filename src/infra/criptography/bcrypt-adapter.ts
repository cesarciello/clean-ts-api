import { Hasher } from '../../data/protocols/criptograpy/hasher'
import bcrypt from 'bcrypt'

export class BCryptAdapter implements Hasher {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {
    const hashValue = await bcrypt.hash(value, this.salt)
    return hashValue
  }
}
