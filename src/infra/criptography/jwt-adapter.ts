import jwt from 'jsonwebtoken'
import { Decrypter, Encrypter } from '@/data/protocols/criptography'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secretKey: string) { }

  async encrypt(value: string): Promise<string> {
    const token = await jwt.sign({ id: value }, this.secretKey)
    return token
  }

  async decrypt(token: string): Promise<string> {
    const value: any = await jwt.verify(token, this.secretKey)
    return value
  }
}
