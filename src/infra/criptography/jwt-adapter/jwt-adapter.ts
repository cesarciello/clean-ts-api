import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/criptograpy/encrypter'

export class JwtAdapter implements Encrypter {
  constructor(private readonly secretKey: string) { }

  async encrypt(value: string): Promise<string> {
    const token = await jwt.sign({ id: value }, this.secretKey)
    return token
  }
}
