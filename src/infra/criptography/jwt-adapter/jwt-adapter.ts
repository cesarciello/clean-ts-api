import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptograpy/decrypter'
import { Encrypter } from '../../../data/protocols/criptograpy/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secretKey: string) { }

  async encrypt(value: string): Promise<string> {
    const token = await jwt.sign({ id: value }, this.secretKey)
    return token
  }

  async decrypt(value: string): Promise<string> {
    const token = await jwt.verify(value, this.secretKey)
    return JSON.stringify(token)
  }
}
