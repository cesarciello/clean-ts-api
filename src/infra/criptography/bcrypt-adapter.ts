import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BCryptAdapter implements Encrypter {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async encrypt(value: string): Promise<string> {
    const encryptValue = await bcrypt.hash(value, this.salt)
    return encryptValue
  }
}
